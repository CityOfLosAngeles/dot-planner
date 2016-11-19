var express = require('express');
var path = require('path');
var app = express();
var port = 3000;

var morgan = require('morgan');

app.use(express.static('./public'));

app.use('/', function(req, res){
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(3000);
