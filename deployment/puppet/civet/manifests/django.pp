class civet::django () {
  $root = "${civet::project_root}/backend"
  $secret_key = fqdn_rand_string(50)
  $static_root = '/srv/static'
  $app_user_home = "/home/${civet::app_user}"
  $virtualenv = "${app_user_home}/venv"
  $python_version = '3.10'

  class { 'python':
    version  => $python_version,
    venv     => 'present',
  }

  python::pyvenv { $virtualenv:
    version => $python_version,
    owner   => $civet::app_user,
    group   => $civet::app_group,
  }

  python::requirements { "${root}/requirements.txt":
    virtualenv  => $virtualenv,
    forceupdate => true,
    owner       => $civet::app_user,
    group       => $civet::app_group,
  }

  file { 'dotenv':
    ensure  => file,
    path    => "${civet::project_root}/.env",
    content => epp('civet/.env.epp'),
    owner   => $civet::app_user,
    group   => $civet::app_group,
  }

  file_line { 'django_settings_module':
    path => "${app_user_home}/.profile",
    line => "export DJANGO_SETTINGS_MODULE=${civet::django_settings_module}",
  }

  file { $static_root:
    ensure => directory,
    owner  => $civet::app_user,
    group  => $civet::app_group,
  }

  $manage = "${virtualenv}/bin/python ${root}/manage.py"

  exec { 'migrate':
    command     => "${manage} migrate",
    environment => ["DJANGO_SETTINGS_MODULE=${civet::django_settings_module}"],
    user        => $civet::app_user,
    group       => $civet::app_group,
    require     => [
      Python::Requirements["${root}/requirements.txt"],
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
