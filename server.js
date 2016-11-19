var express = require('express');
var app = express();
var port = 3000;

var morgan = require('morgan');

app.use(express.static('./public'));


app.listen(3000);
