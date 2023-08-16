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

## Loading data

After the application is provisioned, you still need to populate the database from CSV files. To do that, log onto the instance with either `vagrant ssh` (local) or `aws ssm start-session --target <ID>` (AWS).

If local, ensure that the VM has access to the data files by placing them in an appropriate location. If on an AWS instance, you can place the files in `s3://<stack>-civet-storage/` and they will be available at `/data/`

Then load in the following order:
```
source ~/venv/bin/activate
cd /srv/civet/backend
python3 manage.py load_data -t subject -f /data/clinical_data.csv
python3 manage.py load_data -t visit -f /data/longitudinal_data.csv
python3 manage.py load_data -t mtdna -f /data/AS072_MS170_mtDNA_2_230615.csv
```
