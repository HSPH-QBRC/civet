# @summary Install and configure CIVET API server
#
# Provisions civet API server on Vagrant and AWS
#
class civet (
  String                  $aws_region,
  Optional[String]        $app_user,
  String                  $backend_domain,
  String                  $cloudwatch_log_group,
  String                  $database_host,
  Optional[String]        $database_superuser,
  Optional[String]        $database_superuser_password,
  String                  $database_user_password,
  String                  $deployment_stack,
  String                  $django_cors_origins,
  String                  $django_settings_module,
  String                  $django_superuser_email,
  String                  $django_superuser_password,
  String                  $frontend_domain,
  Optional[String]        $project_root,
  String                  $storage_bucket_name,
) {
  if $facts['virtual'] == 'kvm' {
    $platform = 'aws'
  } else {
    # virtualbox
    $platform = $facts['virtual']
  }

  $app_group = $app_user
  file { $project_root:
    ensure => directory,
    owner  => $app_user,
    group  => $app_group,
  }

  $database_name = 'civet'
  $database_user = $app_user

  $log_dir = '/var/log/civet'
  file { $log_dir:
    ensure => directory,
    owner  => $app_user,
    group  => $app_group,
  }

  $civet_dependencies = [
    'build-essential',
    'apt-transport-https',
    'ca-certificates',
    'gnupg2',
    'zlib1g-dev',
    'libssl-dev',
    'libncurses5-dev',
    'libreadline-dev',
    'libbz2-dev',
    'libffi-dev',
    'liblzma-dev',
    'libsqlite3-dev',
    'libpq-dev',
    'pkg-config',
  ]
  package { $civet_dependencies: }

  $helper_utilities = [
    'curl',
    'nano',
    'netcat',
    'nmon',
    'procps',
  ]
  package { $helper_utilities: }

  contain civet::mountpoint_s3
  contain civet::cloudwatch_agent
  contain civet::django
  contain civet::nginx
  contain civet::postgresql
  contain civet::solr
  contain civet::supervisor

  Class['civet::postgresql']
  ->
  Class['civet::django']
  ~>
  Class['civet::supervisor']
  ->
  Class['civet::nginx']
  ->
  # Note that we put cloudwatch agent last since
  # installing/configuring earlier can lead to UID conflicts
  Class['civet::cloudwatch_agent']
}
