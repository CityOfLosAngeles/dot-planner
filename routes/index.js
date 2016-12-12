module.exports = function(app){

  //Require the controllers
  var application_controller = require('../controllers/application_controller');
	var projects_controller = require('../controllers/projects_controller');
	var users_controller = require('../controllers/users_controller');

  app.use('/', application_controller);
	app.use('/projects', projects_controller);
	app.use('/users', users_controller);
}
