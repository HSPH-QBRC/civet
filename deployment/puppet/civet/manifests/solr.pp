class civet::solr () {
  $solr_home = '/solr'

  file { $solr_home:
    ensure => directory,
    owner  => 'solr',
    group  => 'solr',
  }
  ->
  file { "${solr_home}/solr.xml":
    ensure => file,
    source => "${civet::project_root}/solr/solr.xml",
    owner  => 'solr',
    group  => 'solr',
  }

  class { 'java': }
  ->
  class { 'solr':
    version   => '9.3.0',
    solr_home => $solr_home,
  }
  ->
  solr::core { 'dummy': }
}
