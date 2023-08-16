class civet::postgresql () {
  if $civet::platform == 'aws' {
    class { 'postgresql::server':
      service_manage           => false,
      manage_pg_hba_conf       => false,
      manage_pg_ident_conf     => false,
      manage_recovery_conf     => false,
      default_connect_settings => {
        'PGHOST'     => $civet::database_host,
        'PGPORT'     => '5432',
        'PGUSER'     => $civet::database_superuser,
        'PGPASSWORD' => $civet::database_superuser_password,
      }
    }
  }
  else {
    class { 'postgresql::server': }
  }

  # workaround for https://tickets.puppetlabs.com/browse/MODULES-5068
  postgresql::server::role { $civet::database_user:
    password_hash   => $civet::database_user_password,
    update_password => false,
    createdb        => true,
  }
  ->
  postgresql::server::db { $civet::database_name:
    user     => $civet::database_user,
    password => $civet::database_user_password,
    owner    => $civet::database_user,
  }
}
