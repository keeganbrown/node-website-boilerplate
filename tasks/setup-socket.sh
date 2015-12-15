#!/bin/bash
echo "setup-socket! $1 $2"
if [[ ! -f 'presocketlock' && $1 == 'presocket' ]]; then
	echo "presocketlock"
	touch presocketlock
	[[ ! -d "/var/run/mindandcode" ]] && sudo mkdir /var/run/mindandcode
	sudo chown $2:$2 /var/run/mindandcode
	[[ -d "/var/run/mindandcode" ]] && sudo rm /var/run/mindandcode/*
	rm presocketlock
fi
if [[ ! -f 'postsocketlock' && $1 == 'postsocket' ]]; then
	echo "postsocketlock"
	touch postsocketlock
	sudo chown $2:www-data /var/run/mindandcode/*
	sudo service nginx restart
	rm postsocketlock
fi
if [[ $1 == 'install' ]]; then
	echo 'install nginx'
	sudo apt-get install nginx -y
	[[ -f '/etc/nginx/sites-available/default' ]] && sudo rm /etc/nginx/sites-available/default
	[[ -f '/etc/nginx/sites-enabled/default' ]] && sudo rm /etc/nginx/sites-enabled/default
	sudo rm /etc/nginx/ssl
	[[ ! -f '/etc/nginx/sites-available/mindandcode' ]] && sudo ln -s /home/$2/mindandcode.com/nginx/mindandcode /etc/nginx/sites-available/mindandcode
	[[ ! -f '/etc/nginx/sites-enabled/mindandcode' ]] && sudo ln -s /home/$2/mindandcode.com/nginx/mindandcode /etc/nginx/sites-enabled/mindandcode
	[[ ! -d "/home/$2/mindandcode.com/ssl" ]] && sudo ln -s /home/$2/mindandcode.com/ssl /etc/nginx/ssl
	[[ ! -d '/var/run/mindandcode' ]] && sudo mkdir /var/run/mindandcode
	sudo chown $2:$2 /var/run/mindandcode
	[[ ! -d '/mindandcode.com' ]] && sudo ln -s /home/$2/mindandcode.com /mindandcode.com
	ls /var/run/mindandcode
fi

#visudo entries to be added
#node user must be able to run this script as root in order to use in-memory socket
#$username  ALL=(ALL) NOPASSWD: /home/$username/mindandcode.com/tasks/setup-socket.sh
