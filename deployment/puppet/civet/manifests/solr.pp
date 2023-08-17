class civet::solr () {
  $solr_home = "/solr"

  class { 'solr':
    version     => '8.11.1',  # make sure luceneMatchVersion in all solrconfig.xml files matches this version
    solr_home   => $solr_home,
    schema_name => 'schema.xml',  # classic schema
  }
  file { "${solr_home}/solr.xml":
    ensure => file,
    source => "${civet::project_root}/solr/solr.xml",
    owner  => $::solr::solr_user,
    group  => $::solr::solr_user,
  }
  solr::core { 'subjects':
    schema_src_file     => "${civet::project_root}/solr/subjects/schema.xml",
    solrconfig_src_file => "${civet::project_root}/solr/subjects/solrconfig.xml",
  }
}
