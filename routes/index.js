module.exports = function(app){
	//pointing to controllers
	var application_controller = require('../controllers/application_controller');
	var projects_controller = require('../controllers/projects_controller');
	var users_controller = require('../controllers/users_controller');
	//routing
	app.use('/', application_controller);
	app.use('/projects', projects_controller);
	app.use('/users', users_controller);
  
}
