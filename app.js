var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser'); // for working with cookies
var bodyParser = require('body-parser');
var session = require('express-session'); 
var methodOverride = require('method-override'); // for deletes in express
var hbs = require('hbs');

// override POST to have DELETE and PUT
app.use(methodOverride('_method'))

//sessions
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}));
app.use(cookieParser());

// views and handlebars setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//Register the partials with HBS
hbs.registerPartials(__dirname + '/views/partials');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//spencer's 2 public folders just in case
app.use(express.static(path.join(__dirname, 'public')));
app.use('/projects', express.static(__dirname + '/public'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
require('./routes/index')(app);

//sequelize sync
var models  = require('./models');
var sequelizeConnection = models.sequelize;
// sequelizeConnection.sync({force:true});
sequelizeConnection.sync();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
