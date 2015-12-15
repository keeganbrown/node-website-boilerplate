sudo apt-get install build-essential -y
sudo apt-get install tcl8.5 -y
sudo wget http://download.redis.io/releases/redis-2.8.19.tar.gz
sudo tar xzf redis-2.8.19.tar.gz
sudo cd redis-2.8.19
sudo make
sudo make install
