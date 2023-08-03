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
