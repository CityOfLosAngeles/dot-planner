var models = require('../models/');
var dataSet = require('./export_funded_lines.js');

for (var i = 0; i < dataSet.length; i++) {
	models.Project.create(dataSet[i]);
}

