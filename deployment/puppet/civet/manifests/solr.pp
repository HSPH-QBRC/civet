class civet::solr () {
  # $solr_home = "/solr"
  #
  # package { 'openjdk-19-jre': }
  # ->
  # class { 'solr':
  #   version     => '9.3.0',  # make sure luceneMatchVersion in all solrconfig.xml files matches this version
  #   url         => 'https://dlcdn.apache.org/solr/solr',
  #   manage_java => false,
  #   solr_home   => $solr_home,
  #   schema_name => 'schema.xml',  # classic schema
  # }
  #
  # file { "${solr_home}/solr.xml":
  #   ensure => file,
  #   source => "${civet::project_root}/solr/solr.xml",
  #   owner  => $::solr::solr_user,
  #   group  => $::solr::solr_user,
  # }
  #
  # solr::core { 'dummy':
  #   schema_src_file     => "${civet::project_root}/solr/dummy/schema.xml",
  #   solrconfig_src_file => "${civet::project_root}/solr/dummy/solrconfig.xml",
  # }
}
