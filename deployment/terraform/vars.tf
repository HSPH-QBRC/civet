variable "additional_cors_origins" {
  description = "Origins (including protocol and port) to include, in addition to the frontend_domain var."
  type        = string
  default     = ""
}

variable "backend_domain" {
  description = "The domain where the API will be served from"
  type        = string
}

variable "database_password" {
  description = "Password for mev database user"
  type        = string
  sensitive   = true
}

variable "database_snapshot" {
  description = "RDS snapshot ID"
  type        = string
  default     = null
}

variable "database_superuser_password" {
  description = "Root password for database"
  type        = string
  sensitive   = true
}

variable "django_settings_module" {
  description = "Settings module for the Django app"
  type        = string
  default     = "config.settings_cloud"
}

variable "django_superuser_email" {
  description = "Email address to use as username for Django Admin"
  type        = string
}

variable "django_superuser_password" {
  description = "Django superuser password"
  type        = string
  sensitive   = true
}

variable "frontend_domain" {
  description = "The primary frontend domain this API will serve, do NOT include protocol"
  type        = string
}

variable "git_commit" {
  description = "Git repo code commit or branch name"
  type        = string
  default     = ""
}

variable "https_certificate_id" {
  description = "ID of the HTTPS certificate"
  type        = string
  default     = null
}

variable "route53_managed_zone" {
  description = "Name of the Route53 managed zone"
  type        = string
  default     = null
}
