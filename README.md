# Los Angeles Department of Transportation (DOT) Project Tool

This planning and management tool helps add, review, edit, and search current and future transportation projects.

* [Deployed Application Link](https://still-fjord-74085.herokuapp.com/)
* [Deployed Demo Link](https://serene-ridge-12103.herokuapp.com/)

![ladot](https://cloud.githubusercontent.com/assets/18273101/21868025/c0c87de2-d805-11e6-8355-47a2efb4a1fb.gif)

__Table of Contents__
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installing Locally](#installing-locally)
  * [Installing on Cloud9](#installing-on-cloud9)

## Getting Started

Following these instructions will get you a copy of the project up and running for development purposes.

### Prerequisites

You will need the following installed in order to run this project:

* postgresql, at least v9.4
* node.js & npm

### Installing Locally


### Installing on Cloud9
You'll need to do some basic setup and configuration to run on Cloud9:

* Upgrade postgresql to version 9.4 because of the `jsonb` data type.
* Set up the postgres user's password to match the config settings.
* 
* 

#### Set up a Cloud9 workspace
Create a Cloud9 account.  _Note: Cloud9 requires you to enter a credit card as protection against abuse of their free services._

Connect your Cloud9 account with your GitHub account through your account settings on the Connected Services page.  Once you're connected, go to your Cloud9 dashboard and create a new workspace.

Give your project a name.  Free accounts are only allotted one Private workspace, so unless you really want this project to be that one, select _Public_ for your workspace.

Next up, we want to connect our workspace to a GitHub repo so the project code is loaded and we can push our changes to the repository.  We have two ways to do this:

1. Use the original GitHub repo's SSH URL:

```
git@github.com:datala/dot-planner.git
```

2. Fork the original GitHub repo and use the SSH URL of our fork:

```
git@github.com:<YOUR-USERNAME-HERE>/dot-planner.git
```

Leave the template to its selected default of HTML5 - this is more applicable if you're starting a new project from scratch - and create your workspace!

#### Remove postgres v9.3
As mentioned earlier, you'll need to upgrade postgres.  Cloud9 installs v9.3 by default, but this project uses the `jsonb` datatype and thus requires v9.4.  _Note: run ```sudo service postgresql stop``` to stop postgres if postgres is currently running._

Run the following command to remove postgres:

```
$ sudo apt-get --purge remove postgresql\*
```

#### Install postgres v9.4
The instructions below were adapted from [this Cloud9 support page](https://community.c9.io/t/can-we-upgrade-to-postgres-9-4/3897/4).

Run the following command to edit the `pgdg.list` file using the `vi` editor:

```
$ sudo vi /etc/apt/sources.list.d/pgdg.list
```

Hit the 'i' key to enter "insert" mode.  Type out the following text:

```
deb http://apt.postgresql.org/pub/repos/apt/ trusty-pgdg main
```

Hit the 'Esc' key to exit "insert" mode.  Type ':x' to exit and save.  To confirm your work was saved, you can use the following command to print the file contents to the terminal:

```
$ cat /etc/apt/sources.list.d/pgdg.list
```

Run the following commands to install postgres v9.4:

```
$ wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
$ sudo apt-get update
$ sudo apt-get install postgresql-9.4
```

#### Set up postgres v9.4


Some setup needs to be done on this new install of postgres.  First, modify the `pg_hba.conf` config file to trust local connections:  

```
$ sudo vi /etc/postgresql/9.4/main/pg_hba.conf
```

Hit the 'i' key to enter "insert" mode.  Use the arrow keys to move your cursor down past the commented portions until you reach this line:

```
local   all             postgres                                peer
```

Use the arrow keys to move the cursor to the last column and replace the word `peer` with `trust`:

```
local   all             postgres                                trust
```

Hit the 'Esc' key to exit "insert" mode.  Type ':x' to exit and save.

Start up postgres:

```
$ sudo service postgresql start
```

Now we need to set up two users: `postgres` and `ubuntu`.

Log in to postgres as the user 'postgres'.  _Note: there is no password set by default._

```
$ sudo sudo -u postgres psql
```

At the postgres prompt (`postgres=#`), update the user password as 'password' (from the `/config/config.js` file) by entering the following command:

```
postgres=# \password
```

You'll be prompted to enter a new password twice.  _Note: Linux does not show asterisk (*) charcaters when entering passwords._

Quit using `\q`, then create an `ubuntu` user using the permissions from the `postgres` user:

```
postgres=# \q
$ sudo sudo -u postgres createuser ubuntu
```


### Loading Development Data


### Running Locally


## Loading Production Data


## Deploying


## Contact

---------------------

### Running on Cloud9

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

Congratulations, you've succesfully got the site up and running!  To view it in Cloud9, click the Preview button at the top of the page and select `Preview Running Application`.  In the preview screen, you can then click the `Pop Out Into New Window` icon to open the app in a new browser tab.

To stop the running application, hit `Ctrl-C` in the console.

### Using the Application

Once you've got the application running, navigate to `[application-url]/users/signup` to create an account.  When you log in with your account, you'll be able to see all the data:

![image](https://cloud.githubusercontent.com/assets/1873072/25641160/7bc1a8e2-2f47-11e7-9e7f-c080a1bfc1b9.png)

## Loading Fixtures Data

_Note: This file seems to be already in the repository to this step can be skipped._

To load data from `./db/projects.js` file, create a new file in the `db/` directory called `load.js` and populate with the following code:

```
var models = require('../models/');
var dataSet = require('./projects.js');

for (var i = 0; i < dataSet.length; i++) {
	models.Project.create(dataSet[i]);
}
```

### Add Environment Variable

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

## Loading Production Data

__Note: the Loading Production Data and Deploying on AWS Elastic Beanstalk portions of this README are only applicable to those working on Production.__

To load production data, you'll need the old ATD database zip file stored in a directory called `data` that will be ignored from git. 

```
$ cd etl
$ ./transform_data.sh
```

## Deploying on AWS Elastic Beanstalk

Currently, the application is deploying on elastic beanstalk. To deploy, you'll need to configure your local repo by running `eb init`. 

To deploy the codebase, simply run `eb deploy .`

## Contact

Jacqui Swartz (LADOT, jacqui.swartz@lacity.org)

