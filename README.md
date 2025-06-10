# CIVET
COPD Integrated Visualization and Exploration Tool

## Prerequisites
* Install [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and [Terraform](https://developer.hashicorp.com/terraform/downloads)
* Set up an AWS profile (use `us-east-2` region), for example:
```shell
aws configure --profile civet
export AWS_PROFILE=civet
```

## Initial setup
Only done once to bootstrap the project on AWS. Create and tag a private S3 bucket to store Terraform state:
```shell
aws s3 mb s3://civet-terraform --region us-east-2
aws s3api put-bucket-tagging --bucket civet-terraform --tagging 'TagSet=[{Key=Project,Value=CIVET}]'
```
Configure Terraform:
```shell
cd deployment/terraform
terraform init
```
[Create an HTTPS certificate](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-request-public.html) for `*.tm4.org` in Certificate Manager

[Create a public Route53 hosted zone](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/CreatingHostedZone.html) `civet.tm4.org`

Create an [NS record](https://www.cloudflare.com/learning/dns/dns-records/dns-ns-record/) for `civet.tm4.org` subdomain at the `tm4.org` domain registrar or DNS provider using values from the Route53 hosted zone above

## Deployment
Create a new workspace, for example `dev`:
```shell
terraform workspace new dev
```
Create a CNAME record at the `tm4.org` domain registrar or DNS provider, for example:
```
dev-civet-api.tm4.org    CNAME    dev-api.civet.tm4.org
```
where `dev` is your Terraform workspace name

Configure the site using `terraform.tfvars` file, for example:
```terraform
backend_domain = "dev-civet-api.tm4.org"
django_superuser_email = "admin@example.org"
frontend_domain = "dev-civet.tm4.org"
https_certificate_id = "<UUID>"
```
Deploy the site:
```shell
terraform apply
```

## Cleanup
Delete the site:
```shell
terraform destroy
```

## Loading data to DB

After the application is provisioned, you still need to populate the database from CSV files. To do that, log onto the instance with either `vagrant ssh` (local) or `aws ssm start-session --target <ID>` (AWS).

If local, ensure that the VM has access to the data files by placing them in an appropriate location on the host machine. If on an AWS instance, you can place the files in `s3://<stack>-civet-storage/` and they will be available at `/data/`

Depending on your deployment, you will need to set your "django root" accordingly; this is where the Django `manage.py` lives. If local, this will be at `DJANGO_ROOT=/vagrant/backend/`. If on AWS, `DJANGO_ROOT=/srv/civet/backend/`. Then:
```
source ~/venv/bin/activate
python3 $DJANGO_ROOT/manage.py load_data -t subject -f /data/clinical_data.csv
python3 $DJANGO_ROOT/manage.py load_data -t visit -f /data/longitudinal_data.csv
python3 $DJANGO_ROOT/manage.py load_data -t mtdna -f /data/AS072_MS170_mtDNA_2_230615.csv
```

## Loading data into solr (if used)

If you wish to use solr to assist with faceted views, you will need to load files into the solr index after the application is provisioned. To do that, log onto the instance with either `vagrant ssh` (local) or `aws ssm start-session --target <ID>` (AWS).

Then run the following to load the subjects file:
```
/opt/solr/bin/post -c subjects /data/clinical_data.csv
```
(adjust the path to the clinical/subjects file as necessary)


## Add new user
Connect to EC2 instance
```
source ~/venv/bin/activate
python3 manage.py shell
from django.contrib.auth import get_user_model
User = get_user_model()
user = User.objects.create_user('username', 'email@email.com', 'password')
```