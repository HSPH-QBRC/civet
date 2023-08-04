class civet::supervisor () {
  $conf_dir = '/etc/supervisor'

  package { 'supervisor': }
  ->
  file {
    default:
      ensure => file,;
    "${conf_dir}/supervisord.conf":
      content => epp('civet/supervisor/supervisord.conf.epp'),;
    "${conf_dir}/conf.d/gunicorn.conf":
      content => epp('civet/supervisor/gunicorn.conf.epp'),;
  }
  ->
  file { '/tmp/supervisor':
    ensure => directory,
    owner  => $civet::app_user,
    group  => $civet::app_group,
  }
  ~>
  service { 'supervisor':
    ensure => running,
    enable => true,
  }
}
