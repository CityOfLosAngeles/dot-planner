# Los Angeles Transportation Project Tool

This planning and management tool helps add, review, edit, and search current and future transportation projects.

* [Deployed Application Link](https://still-fjord-74085.herokuapp.com/)
* [Deployed Demo Link](https://serene-ridge-12103.herokuapp.com/)

![ladot](https://cloud.githubusercontent.com/assets/18273101/21868025/c0c87de2-d805-11e6-8355-47a2efb4a1fb.gif)

## Getting Started

Following these instructions will get you a copy of the project up and running on your local machine for development purposes.

### Running on Cloud9
You'll need to do some basic setup and configuration to run on Cloud9:

* Upgrade postgresql to version 9.4 because of the ```jsonb``` data type.
* Set up the postgres user's password to match the config settings.

#### Create a new Cloud9 workspace
Use the GitHub repo's SSH URL:

```
git@github.com:datala/dot-planner.git
```

#### Remove postgres v9.3
_Note: run ```sudo service postgresql stop``` if postgres is running._

```
$ sudo apt-get --purge remove postgresql\*
```

#### Install postgres v9.4
Instructions adapted from [this Cloud9 support page](https://community.c9.io/t/can-we-upgrade-to-postgres-9-4/3897/4).

```
$ sudo vi /etc/apt/sources.list.d/pgdg.list
```

Hit the 'i' key to enter "insert" mode.  Type out the following text:

```
deb http://apt.postgresql.org/pub/repos/apt/ trusty-pgdg main
```

Hit the 'Esc' key to exit "insert" mode.  Type ':x' to exit and save.  To confirm your work, use the following command to print the file contents to the terminal:

```
$ cat /etc/apt/sources.list.d/pgdg.list
```

Run the following commands:

```
$ wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
$ sudo apt-get update
$ sudo apt-get install postgresql-9.4
```

Modify a config file to trust local connections:

```
$ sudo vi /etc/postgresql/9.4/main/pg_hba.conf
```

Hit the 'i' key to enter "insert" mode.  Move your cursor to modify the last column of the following line:

```
local   all             postgres                                trust
```

Hit the 'Esc' key to exit "insert" mode.  Type ':x' to exit and save.

Start up postgres:

```
$ sudo service postgresql start
```

Log in to postgres as the user 'postgres'.  _Note: there is no password set by default._

```
$ sudo sudo -u postgres psql
```

At the postgres prompt, update the user password as 'password' (from the /config/config.js file):

```
postgres=# \password
```

Now you're ready to follow the installation instructions below!


### Installing

Install the required npm packages.

```
npm install
```

Run sequelize migrations.

```
sequelize db:migrate
```

To start the application:

```
npm start
```

To load data from ./db/projects.js file, create a new file in the db/ director caleld `load.js` and populate with the following code:
```
var models = require('../models/');
var dataSet = require('./projects.js');

for (var i = 0; i < dataSet.length; i++) {
	models.Project.create(dataSet[i]);
}
```
- From command line in /db directory, run `node load.js`

To load data. You'll need the old ATB database zip file stored in a directory called `data` that will be ignored from git. 

```
cd etl
./transform_data.sh
```

## Deploying

Currently, the application is deploying on elastic beanstalk. To deploy, you'll need to configure your local repo by running `eb init`. 

To deploy the codebase, simply run `eb deploy .`

## Contact

Jacqui Swartz (LADOT, jacqui.swartz@lacity.org)

