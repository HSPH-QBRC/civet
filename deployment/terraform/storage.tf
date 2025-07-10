resource "aws_s3_bucket" "api_storage_bucket" {
    bucket = "${local.stack}-civet-storage-jq"
}


resource "aws_s3_bucket_server_side_encryption_configuration" "main_storage" {
  bucket = aws_s3_bucket.api_storage_bucket.bucket

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
    }
    bucket_key_enabled = true
  }
}
