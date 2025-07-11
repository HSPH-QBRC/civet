class { 'civet':
  aws_region                     => $facts['aws_region'],
  backend_domain                 => $facts['backend_domain'],
  database_host                  => $facts['database_host'],
  database_superuser             => $facts['database_superuser'],
  database_superuser_password    => $facts['database_superuser_password'],
  database_user_password         => $facts['database_user_password'],
  deployment_stack               => $facts['deployment_stack'],
  django_cors_origins            => $facts['django_cors_origins'],
  django_settings_module         => $facts['django_settings_module'],
  django_superuser_email         => $facts['django_superuser_email'],
  django_superuser_password      => $facts['django_superuser_password'],
  frontend_domain                => $facts['frontend_domain'],
  storage_bucket_name            => $facts['storage_bucket_name']
}
