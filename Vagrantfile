# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/jammy64"

  config.vm.hostname = "civet"

  config.vm.network "forwarded_port", guest: 80, host: 8080  # Gunicorn
  config.vm.network "forwarded_port", guest: 8000, host: 8000  # Django dev server
  config.vm.network "forwarded_port", guest: 8983, host: 8983  # Solr

  config.vm.provider "virtualbox" do |vb|
    vb.memory = 2048
    vb.cpus = 2
  end

  config.vm.provision "shell", inline: <<-SHELL
    # https://serverfault.com/a/670688
    export DEBIAN_FRONTEND=noninteractive
    # exit immediately on errors in any command
    set -e
    # print commands and their expanded arguments
    set -x

    # install Puppet
    OS_CODENAME=$(/usr/bin/lsb_release -sc)
    PUPPET_PACKAGE=puppet8-release-${OS_CODENAME}.deb
    /usr/bin/curl -sO "https://apt.puppetlabs.com/${PUPPET_PACKAGE}"
    /usr/bin/dpkg -i "$PUPPET_PACKAGE"

    # workaround to replace expired GPG key
    /usr/bin/apt-key adv --keyserver hkp://keyserver.ubuntu.com:11371 --recv-key 4528B6CD9E61EF26
    /usr/bin/apt-get -qq update
    /usr/bin/apt-get -qq -y install puppet-agent

    # install and configure librarian-puppet
    export PUPPET_ROOT="/vagrant/deployment/puppet"
    /opt/puppetlabs/puppet/bin/gem install librarian-puppet -v 5.1.0 --no-document
 
    # need to set $HOME: https://github.com/rodjek/librarian-puppet/issues/258
    export HOME=/root
    /opt/puppetlabs/puppet/bin/librarian-puppet config path /opt/puppetlabs/puppet/modules --global
    /opt/puppetlabs/puppet/bin/librarian-puppet config tmp /tmp --global
    cd $PUPPET_ROOT
    PATH=$PATH:/opt/puppetlabs/bin
    /opt/puppetlabs/puppet/bin/librarian-puppet install
  SHELL

  config.vm.provision :puppet do |puppet|
    puppet.manifests_path = "deployment/puppet/manifests"
    puppet.manifest_file  = "site.pp"
  end
end
