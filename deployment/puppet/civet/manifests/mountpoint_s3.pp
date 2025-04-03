class civet::mountpoint_s3 () {

  if $civet::platform == 'aws' {

    $data_dir = '/data'
    $mountpoint_deb = '/tmp/mountpoint_s3.deb'

    file { $data_dir:
        ensure => directory,
        owner  => $civet::app_user,
        group  => $civet::app_group,
    }

    file { $mountpoint_deb:
        ensure => present,
        source => 'https://s3.amazonaws.com/mountpoint-s3-release/latest/x86_64/mount-s3.deb',
    }

    package { 'mountpoint-s3':
        provider => dpkg,
        source   => $mountpoint_deb
    }
    ->
    exec { 'mount-s3':
        command  => "/usr/bin/mount-s3 ${civet::storage_bucket_name} ${data_dir}",
        user     => $civet::app_user,
        group    => $civet::app_group,
        require  => File[$data_dir],
    }
  }
  
}