# Los Angeles Transportation Project Tool

This planning and management tool helps add, review, edit, and search current and future transportation projects.

* [Deployed Application Link](https://still-fjord-74085.herokuapp.com/)
* [Deployed Demo Link](https://serene-ridge-12103.herokuapp.com/)

![ladot](https://cloud.githubusercontent.com/assets/18273101/21868025/c0c87de2-d805-11e6-8355-47a2efb4a1fb.gif)

## Getting Started

Following these instructions will get you a copy of the project up and running on your local machine for development purposes.

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

## Authors (alphabetical order)

* Spencer Charest, *spencercharest*
* Colin McDaniel, *colinmcdaniel*
* Stephanie Orpilla, *stephorpilla*
* Eliot Reyes, *emrzero*
