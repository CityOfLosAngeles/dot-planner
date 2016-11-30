var express = require('express');
var router = express.Router();
var models = require('../models');
// var Geo = require('../models/Geo.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('map');
});


//Renders the new project page where PM can add projects
router.get('/projects/new', function(req, res){
  res.render('new-project');
})

//Gets all projects from the DB
router.get('/projects', function(req, res){
  var featureCollection = {
      "type": "FeatureCollection",
      features: []
  };
  models.Project.findAll().then(function(data){
    // console.log(data[1].uid);
    for (var i = 0; i < data.length; i++) {
      var newGeo = {
          type: "Feature",
          properties: {
            UID: data[i].uid,
            title: data[i].project_title,
            description: data[i].project_description
          },
          geometry: data[i].geometry
      }
      featureCollection.features.push(newGeo);
    }
    res.send(featureCollection);
  });
});

//Saves a new project to the DB
router.post('/projects/new', function(req, res){
  var coordinates = JSON.parse(req.body.coordinates);
  models.Project.create({
    uid: req.body.UID,
    project_title: req.body.title,
    project_description: req.body.description,
    geometry: {
      type: req.body.type,
      coordinates: coordinates
    }
  });

  // TODO: Research proper status code to send back after successful POST
  res.send({"success": "Yes!"});
});

module.exports = router;
