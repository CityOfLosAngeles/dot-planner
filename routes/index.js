var express = require('express');
var router = express.Router();
var Geo = require('../models/Geo.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/geo', function(req, res){
  Geo.find({}).exec(function(err, found){
    if (err) {
      res.send(err);
    } else {
      res.send(found);
    }
  });
});

router.post('/new/geo', function(req, res){
  var coordinates = JSON.parse(req.body.coordinates);
  var data = {
    properties: {
      UID: req.body.UID,
      title: req.body.title,
      description: req.body.description
    },
    geometry: {
      type: req.body.type,
      coordinates: coordinates
    }
  }
  var newGeo = new Geo(data);
  newGeo.save(function(err){
    if(err){
      console.log(err);
    }
    console.log('Successfully saved to Mongo');
  });
  res.send({"success": "Yes!"});
});

module.exports = router;
