var models = require('../models/');
var dataSet = require('./projects.js');

for (var i = 0; i < dataSet.length; i++) {
    models.Project.create(dataSet[i]);
}

