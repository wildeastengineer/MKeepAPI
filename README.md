# MKeepAPI
MoneyKeeper API

### Preparation
Update package manager:
```
$ sudo apt-get update
```
Install Git:
```
$ sudo apt-get install git
```
Install Node.js:
```
$ curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
$ sudo apt-get install -y nodejs
```
Install Nodemon:
```
$ sudo npm install nodemon -g
```

### Install MongoDB:
Import the public key used by the package management system:
```
$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
```
Create a list file for MongoDB:

Ubuntu 12.04
```
$ echo "deb http://repo.mongodb.org/apt/ubuntu precise/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
```
Ubuntu 14.04
```
$ echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
```
Install the MongoDB packages:
```
$ sudo apt-get update
$ sudo apt-get install -y mongodb-org
```
More information [here](https://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/)

### Installation
Check out the code
```
$ git clone git@github.com:wildeastengineer/MKeepAPI.git
$ cd MKeepAPI
```
```
$ git checkout --track origin/develop
```

Install npm packages:
```
$ sudo npm install
```

### Run
MongoDB:
```
$ sudo service mongod start
```
App:
```
$ nodemon server.js
```
Try to send *GET* request to `localhost:8080/api`

### Additional Information
**MongoDB**

- restart mongo: `$ sudo service mongod restart`
- stop mongo: `$ sudo service mongod stop`
