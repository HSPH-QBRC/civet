class civet::django () {
  $root = "${civet::project_root}/civet"
  $secret_key = fqdn_rand_string(50)
  $static_root = '/srv/static'

  class { 'python':
    version => '3.10',
  }

  python::requirements { 'civet':
    requirements           => "${root}/requirements.txt",
    pip_provider           => 'pip3',
    forceupdate            => true,
    fix_requirements_owner => false,
  }

  file { 'dotenv':
    ensure  => file,
    path    => "${civet::project_root}/.env",
    content => epp('civet/.env.epp'),
    owner   => $civet::app_user,
    group   => $civet::app_group,
  }

  file_line { 'django_settings_module':
    path => "/home/${civet::app_user}/.profile",
    line => "export DJANGO_SETTINGS_MODULE=${civet::django_settings_module}",
  }

  file { $static_root:
    ensure => directory,
    owner  => $civet::app_user,
    group  => $civet::app_group,
  }

  $manage = "/usr/bin/python3 ${root}/manage.py"

  exec { 'migrate':
    command     => "${manage} migrate",
    environment => ["DJANGO_SETTINGS_MODULE=${civet::django_settings_module}"],
    user        => $civet::app_user,
    group       => $civet::app_group,
    require     => [
      Python::Requirements['civet'],
      File['dotenv'],
    ],
  }
  ->
  exec { 'superuser':
    command     => "${manage} superuser --noinput --email ${civet::django_superuser_email}",
    environment => [
      "DJANGO_SETTINGS_MODULE=${civet::django_settings_module}",
      "DJANGO_SUPERUSER_USERNAME=admin",
      "DJANGO_SUPERUSER_PASSWORD=${civet::django_superuser_password}",
    ],
    user        => $civet::app_user,
    group       => $civet::app_group,
  }
  ->
  exec { 'collectstatic':
    command     => "${manage} collectstatic --noinput",
    environment => ["DJANGO_SETTINGS_MODULE=${civet::django_settings_module}"],
    user        => $civet::app_user,
    group       => $civet::app_group,
    require     => File[$static_root],
  }
}
