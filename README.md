# Los Angeles Transportation Project Tool

This planning and management tool helps add, review, edit, and search current and future transportation projects.

* [Deployed Application Link](https://still-fjord-74085.herokuapp.com/)
* [Deployed Demo Link](https://serene-ridge-12103.herokuapp.com/)

![ladot](https://cloud.githubusercontent.com/assets/18273101/21868025/c0c87de2-d805-11e6-8355-47a2efb4a1fb.gif)

## Getting Started

Following these instructions will get you a copy of the project up and running on your local machine for development purposes.

### Running on Cloud9
You'll need to do some basic setup and configuration to run on Cloud9:

* Upgrade postgresql to version 9.4 because of the `jsonb` data type.
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

Hit the 'i' key to enter "insert" mode.  Move your cursor down past the commented portions to modify the last column of the following line, changing `peer` to `trust`:

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

Quit using `\q`, then create an `ubuntu` user using the permissions from the `postgres` user:

```
postgres=# \q
$ sudo sudo -u postgres createuser ubuntu
```

Now you're ready to follow the installation instructions below!


### Installing

Install the required npm packages.

```
$ npm install
```

Note: until there is a fix added to the code, you will need to manually add the following lines to the file `\migrations\20161211165146-create-project.js`, between the column definitions for `Flagged` and `DupID`:

```
TotalUnmetFunding: {
  type: Sequelize.INTEGER
},
ProjectStartDate: {
  allowNull: true,
  type: Sequelize.DATE
},
ProjectProjectedCompletionDate: {
  allowNull: true,
  type: Sequelize.DATE
},
```

Now you can run sequelize migrations.

```
$ sequelize db:migrate
```

Update the package.json file to set a value for NODE_ENV:

```
"scripts": {
    "start": "NODE_ENV=development node ./bin/www"
},
```

Start the application:

```
$ npm start
```

The console will output the following:

```
> map@0.0.0 start /home/ubuntu/workspace
> NODE_ENV=development node ./bin/www

express-session deprecated undefined resave option; provide resave option app.js:16:9
express-session deprecated undefined saveUninitialized option; provide saveUninitialized option app.js:16:9
```

To preview the now-running site in Cloud9, click the Preview button at the top of the page and select `Preview Running Application`.  In the preview screen, you can then click the `Pop Out Into New Window` icon to open the app in a new browser tab.

To stop the running application, hit `Ctrl-C` in the console.

### Loading Data

_Note: This file seems to be already in the repository to this step can be skipped._

_To load data from `./db/projects.js` file, create a new file in the `db/` directory called `load.js` and populate with the following code:_

```
var models = require('../models/');
var dataSet = require('./projects.js');

for (var i = 0; i < dataSet.length; i++) {
	models.Project.create(dataSet[i]);
}
```

#### Add Environment Variable

If the application is running, hit `Ctrl-C` in the console to stop it.  Navigate to the `~/.bashrc` file to set the environment variable.

If you are currently in the `~\workspace` folder, which is the default folder Cloud9 puts you in, run the following commands:

```
$ cd ../
$ vi .bashrc
```

Hit `i` to enter INSERT mode.  Scroll to the very bottom and add the line:

```
export NODE_ENV=development
```

Now this environment variable will be set when you restart your terminal.  Hit `Esc` to exit INSERT mode and type `:x` to save and quit.  Close the current terminal and open a new one.

Go to the `\db` folder and run `load.js`:

```
$ cd db
$ node load.js
```
_Note: the below command gives me an error: **database "dot" does not exist**_

To load data. You'll need the old ATD database zip file stored in a directory called `data` that will be ignored from git. 

```
$ cd etl
$ ./transform_data.sh
```

## Deploying

Currently, the application is deploying on elastic beanstalk. To deploy, you'll need to configure your local repo by running `eb init`. 

To deploy the codebase, simply run `eb deploy .`

## Contact

Jacqui Swartz (LADOT, jacqui.swartz@lacity.org)

