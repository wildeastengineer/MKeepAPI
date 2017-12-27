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
Install Gulp:
```
$ sudo npm install --global gulp-cli
```

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

### Run
MongoDB:
```
$ sudo service mongod start
```
App:

To launch develop version of the server:

```
$ npm run dev
```

To launch prod version of the server:

```
$ npm start
```

Try to send *GET* request to `localhost:8080/api`

REST Client for Chrome: [Postman](https://chrome.google.com/webstore/detail/postman-rest-client-short/mkhojklkhkdaghjjfdnphfphiaiohkef)

### Additional Information
**MongoDB**

- restart mongo: `$ sudo service mongod restart`
- stop mongo: `$ sudo service mongod stop`

# Tests

### Unit Tests

All test specs are placed in `./test` directory
Unit tests automatically run on commit

To run all tests during development process just call `gulp test`

### SoapUI Tests (web API tests)

For web API tests MK uses [SoapUI Open Source](https://www.soapui.org/open-source.html)
To run tests:

- Install [SoapUI Open Source](https://www.soapui.org/getting-started/installing-soapui.html)
- Import SoapUI project (it is presented as xml file) that is stored in `./test/soapUI/MP_API.xml`
- Launch existing test suite (double click on test suite to open launcher)

(!) Please make sure that all tests pass before you push any changes related to web API
