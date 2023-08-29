class civet::supervisor () {
  $conf_dir = '/etc/supervisor'
  $log_dir = '/var/log/supervisor'

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
  ~>
  service { 'supervisor':
    ensure => running,
    enable => true,
  }
}
