# This allows the EC2 instance to assume a particular role.
# This enables us, for instance, to give the EC2 server 
# permissions to access the S3 buckets. Note that this block alone
# does not give that permission.
resource "aws_iam_role" "api_server_role" {
  name               = "${local.common_tags.Name}-api"
  assume_role_policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Sid       = ""
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_role_policy" "server_s3_access" {
  name   = "AllowAccessToStorageBuckets"
  role   = aws_iam_role.api_server_role.id
  policy = jsonencode(
    {
      Version   = "2012-10-17",
      Statement = [
        {
          Effect   = "Allow",
          Action   = ["s3:GetObject", "s3:PutObject", "s3:PutObjectAcl", "s3:DeleteObject"],
          Resource = [
            "arn:aws:s3:::${aws_s3_bucket.api_storage_bucket.id}/*",
          ]
        },
        {
          Effect   = "Allow",
          Action   = ["s3:ListBucket"],
          Resource = [
            "arn:aws:s3:::${aws_s3_bucket.api_storage_bucket.id}",
          ]
        }
      ]
    }
  )
}

# For adding SSM to the instance:
resource "aws_iam_role_policy_attachment" "api_server_ssm" {
  role       = aws_iam_role.api_server_role.id
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role_policy_attachment" "api_server_cloudwatch" {
  role       = aws_iam_role.api_server_role.id
  policy_arn = "arn:aws:iam::aws:policy/AWSOpsWorksCloudWatchLogs"
}

resource "aws_iam_role_policy_attachment" "api_server_cloudwatch_agent" {
  role       = aws_iam_role.api_server_role.id
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}

resource "aws_iam_role_policy" "log_retention" {
  name   = "AllowCLoudWatchLogRetention"
  role   = aws_iam_role.api_server_role.id
  policy = jsonencode(
    {
      Version   = "2012-10-17",
      Statement = [
        {
          Effect   = "Allow",
          Action   = ["logs:PutRetentionPolicy"],
          Resource = "*"
        }
      ]
    }
  )
}

resource "aws_iam_instance_profile" "api_server_instance_profile" {
  name = "${local.common_tags.Name}-api"
  role = aws_iam_role.api_server_role.name
}

# password used by django for db access.
# Only used if not explicitly set in tfvars
resource "random_password" "civet_db" {
  length  = 8
  special = false
}

# superuser password for django.
# Only used if not explicitly set in tfvars 
resource "random_password" "django_superuser" {
  length  = 8
  special = false
}

resource "aws_instance" "api" {
  # Ubuntu 22.04 LTS https://cloud-images.ubuntu.com/locator/ec2/
  ami                    = "ami-05d251e0fc338590c"
  instance_type          = "t3.small"
  monitoring             = true
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.api_server.id]
  ebs_optimized          = true
  iam_instance_profile   = aws_iam_instance_profile.api_server_instance_profile.name
  tags                   = {
    Name = "${local.common_tags.Name}-api"
  }
  volume_tags = merge(local.common_tags, { Name = "${local.common_tags.Name}-api" })
  root_block_device {
    volume_type = "gp3"
    volume_size = 10
    encrypted   = true
  }
  user_data_replace_on_change = true
  user_data                   = <<-EOT
  #!/usr/bin/bash -ex

  # https://serverfault.com/a/670688
  export DEBIAN_FRONTEND=noninteractive

  # to help Puppet determine the correct node name
  /usr/bin/hostnamectl set-hostname ${local.backend_cname}

  # install Puppet
  OS_CODENAME=$(/usr/bin/lsb_release -sc)
  PUPPET_PACKAGE=puppet8-release-$${OS_CODENAME}.deb
  /usr/bin/curl -sO "https://apt.puppetlabs.com/$${PUPPET_PACKAGE}"
  /usr/bin/dpkg -i "$PUPPET_PACKAGE"
  # workaround to replace expired GPG key
  /usr/bin/apt-key adv --keyserver hkp://keyserver.ubuntu.com:11371 --recv-key 4528B6CD9E61EF26
  /usr/bin/apt-get -qq update
  /usr/bin/apt-get -qq -y install puppet-agent nvme-cli

  # configure CIVET
  export PROJECT_ROOT=/srv/civet
  /usr/bin/mkdir $PROJECT_ROOT
  /usr/bin/chown ubuntu:ubuntu $PROJECT_ROOT
  /usr/bin/su -c "git clone https://github.com/hsph-qbrc/civet.git $PROJECT_ROOT" ubuntu
  /usr/bin/su -c "cd $PROJECT_ROOT && /usr/bin/git checkout -q ${local.commit_id}" ubuntu

  # install and configure librarian-puppet
  export PUPPET_ROOT="$PROJECT_ROOT/deployment-aws/puppet"
  /opt/puppetlabs/puppet/bin/gem install librarian-puppet -v 5.1.0 --no-document
  # need to set $HOME: https://github.com/rodjek/librarian-puppet/issues/258
  export HOME=/root
  /opt/puppetlabs/puppet/bin/librarian-puppet config path /opt/puppetlabs/puppet/modules --global
  /opt/puppetlabs/puppet/bin/librarian-puppet config tmp /tmp --global
  cd $PUPPET_ROOT
  PATH=$PATH:/opt/puppetlabs/bin
  /opt/puppetlabs/puppet/bin/librarian-puppet install

  # configure and run Puppet
  export FACTER_AWS_REGION='${data.aws_region.current.name}'
  export FACTER_BACKEND_DOMAIN='${var.backend_domain}'
  export FACTER_CLOUDWATCH_LOG_GROUP='${aws_cloudwatch_log_group.default.name}'
  export FACTER_DATABASE_HOST='${aws_db_instance.default.address}'
  export FACTER_DATABASE_SUPERUSER='${aws_db_instance.default.username}'
  export FACTER_DATABASE_SUPERUSER_PASSWORD='${aws_db_instance.default.password}'
  export FACTER_DATABASE_USER_PASSWORD='${var.database_password == null ? random_password.civet_db.result : var.database_password}'
  export FACTER_DEPLOYMENT_STACK='${local.stack}'
  export FACTER_DJANGO_CORS_ORIGINS='https://${var.frontend_domain},${var.additional_cors_origins}'
  export FACTER_DJANGO_SETTINGS_MODULE='${var.django_settings_module}'
  export FACTER_DJANGO_SUPERUSER_EMAIL='${var.django_superuser_email}'
  export FACTER_DJANGO_SUPERUSER_PASSWORD='${var.django_superuser_password == null ? random_password.django_superuser.result : var.django_superuser_password}'
  export FACTER_FRONTEND_DOMAIN='${var.frontend_domain}'
  export FACTER_STORAGE_BUCKET_NAME='${aws_s3_bucket.api_storage_bucket.id}'

  /opt/puppetlabs/bin/puppet apply $PUPPET_ROOT/manifests/site.pp
  EOT
}
