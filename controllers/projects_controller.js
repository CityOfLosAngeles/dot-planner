var express = require('express');
var router = express.Router();
var models = require('../models');

//function to convert from DB to geoJSON
function toGeoJSON(project, features) {
  var fundStatus = project.Fund_St;
  //Create the newProject object and set common attributes
  var feature = {

    type: "Feature",
    //Geometry
    geometry: project.Geometry,

    properties: {
      //Common Attributes
      Fund_St: project.Fund_St,
      Legacy_ID: project.Legacy_ID,
      Lead_Ag: project.Lead_Ag,
      Proj_Title:project.Proj_Title,
      Proj_Ty: project.Proj_Ty,
      Proj_Desc: project.Proj_Desc,
      Contact_info: project.Contact_info,
      More_info: project.More_info
    }
  }

  //Funded and Unfunded but NOT Idea Attributes
  if (fundStatus != 'Idea Project') {
    feature.properties.Primary_Street = project.Primary_Street;
    feature.properties.Cross_Streets =  project.Cross_Streets;
    feature.properties.CD = project.CD;
    feature.properties.Proj_Status = project.Proj_Status;
    feature.properties.Proj_Man = project.Proj_Man;
  }
  //Funded Attributes
  if (fundStatus === 'Funded') {
    feature.properties.Dept_Proj_ID = project.Dept_Proj_ID;
    feature.properties.Other_ID = project.Other_ID;
    feature.properties.Total_bgt = project.Total_bgt;
    feature.properties.Grant = project.Grant;
    feature.properties.Other_funds = project.Other_funds;
    feature.properties.Prop_c = project.Prop_c;
    feature.properties.Measure_r = project.Measure_r;
    feature.properties.Gas_Tax = project.Gas_Tax;
    feature.properties.General_fund = project.General_fund;
    feature.properties.Authorization = project.Authorization;
    feature.properties.Issues = project.Issues;
    feature.properties.Deobligation = project.Deobligation;
    feature.properties.Explanation = project.Explanation;
    feature.properties.Constr_by = project.Constr_by;
    feature.properties.Info_source = project.Info_source;
    feature.properties.Access = project.Access;
  }

  //Unfunded Attributes
  if (fundStatus === 'Unfunded') {
    feature.properties.Grant_Cat = project.Grant_Cat;
    feature.properties.Grant_Cycle = project.Grant_Cycle;
    feature.properties.Est_Cost = project.Est_Cost;
    feature.properties.Fund_Rq = project.Fund_Rq;
    feature.properties.Lc_match = project.Lc_match;
    feature.properties.Match_Pt = project.Match_Pt;
  }

  features.push(feature);
}

//Renders the new project page where PM can add projects
router.get('/new', function(req, res) {
    res.render('new-project');
});

//Returns ALL projects from the DB
router.get('/all', function(req, res) {
  var featureCollection = {
      "type": "FeatureCollection",
      features: []
  };
  models.Project.findAll().then(function(projects) {
    for (var i = 0; i < projects.length; i++) {
      toGeoJSON(projects[i], featureCollection.features);
    }
  }).then(function(){
    res.send(featureCollection);
  });
});

//Takes funding status parameters and returns only projects of the requested funding status
router.get('/:status', function(req, res) {
  var featureCollection = {
      "type": "FeatureCollection",
      features: []
  };
  var status = req.params.status;
  status = status.split('&')
  for (var i = 0; i < status.length; i++) {
    status[i] = status[i].charAt(0).toUpperCase() + status[i].substr(1);
  }
  var searchArr = [ ];
  for (var i = 0; i < status.length; i++) {
    var searchObj = {
      Fund_St: status
    }
    searchArr.push(searchObj);
  }
  models.Project.findAll({
    where: {
      $or: searchArr
    }
  }).then(function(projects) {
    for (var i = 0; i < projects.length; i++) {
      toGeoJSON(projects[i], featureCollection.features);
    }
    res.send(featureCollection);
  });
});

//Saves a new project to the DB
router.post('/new', function(req, res) {
    var newProject = req.body;
    var fundStatus = newProject.Fund_St;
    var geometry = JSON.parse(newProject.Geometry);
    var coordinates = JSON.parse(geometry.coordinates);
    var parsedGeometry = {
        type: geometry.type,
        coordinates: coordinates
    }
    newProject.Geometry = parsedGeometry;
    var contactInfo = JSON.parse(newProject.Contact_info);
    newProject.Contact_info = contactInfo;

    if (fundStatus === 'Idea Project') {
      models.Project.create(newProject).then(function() {
        res.send({"success": "Yes!"});
      });
    } else {
      var crossStreets = JSON.parse(newProject.Cross_Streets);
      newProject.Cross_Streets = crossStreets;
      models.Project.create(newProject).then(function() {
        res.send({"success": "Yes!"});
      });
    }
    console.log(newProject);
});

module.exports = router;
