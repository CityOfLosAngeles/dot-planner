var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var routes = require('./routes/index');

var app = express();

//MongoDB setup

//local mongo instance
// var link = 'mongodb://localhost/geo';
var link = 'mongodb://heroku_77qf8k9j:mmnlmmn5hsqf7qm90672v5htfe@ds159237.mlab.com:59237/heroku_77qf8k9j';

// Drop DB (uncomment this if you want to drop DB on start)
// mongoose.connect(link, function() {
//     mongoose.connection.db.dropDatabase();
// });

mongoose.connect(link);

var db = mongoose.connection;

db.on('error', function(err) {
    console.log('database error', err);
});

db.once('open', function() {
    console.log("Mongoose is connected!");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

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
