var express = require('express');
var router = express.Router();
var models = require('../models');

function toGeoJSON(project, features) {
  if (project.Fund_St === 'Funded') {
    var feature = {
      type: "Feature",
      geometry: project.Geometry,
      properties: {
        UID: project.UID,
        Proj_Title: project.Proj_Title,
        Proj_Desc: project.Proj_Desc,
        Lead_Ag: project.Lead_Ag,
        Fund_St: project.Fund_St,
        Proj_Man: project.Proj_Man,
        Contact_info: project.Contact_info,
        More_info: project.More_info,
        CD: project.CD,
        Access: project.Access,

        //Funded Attributes
        Dept_Proj_ID: project.Dept_Proj_ID,
        Total_bgt: project.Total_bgt,
        Grant: project.Grant,
        Other_funds: project.Other_funds,
        Prop_c: project.Prop_c,
        Measure_r: project.Measure_r,
        General_fund: project.General_fund,
        Current_Status: project.Current_Status,
        Issues: project.Issues,
        Deobligation: project.Deobligation,
        Explanation: project.Explanation,
        Other_ID: project.Other_ID,
        Constr_by: project.Constr_by,
        Info_source: project.Info_source,

        //Unfunded attributes
        Grant_Cat: project.Grant_Cat,
        Proj_Ty: project.Proj_Ty,
        Est_Cost: project.Est_Cost,
        Fund_Rq: project.Fund_Rq,
        Lc_match: project.Lc_match,
        Match_Pt: project.Match_Pt,
        Comments: project.Comments
      }
    }
  } else {
    var feature = {
      type: "Feature",
      geometry: project.Geometry,
      properties: {
        UID: project.UID,
        Proj_Title: project.Proj_Title,
        Proj_Desc: project.Proj_Desc,
        Lead_Ag: project.Lead_Ag,
        Fund_St: project.Fund_St,
        Proj_Man: project.Proj_Man,
        Contact_info: project.Contact_info,
        More_info: project.More_info,
        CD: project.CD,
        Access: project.Access,

        //Unfunded attributes
        Grant_Cat: project.Grant_Cat,
        Proj_Ty: project.Proj_Ty,
        Est_Cost: project.Est_Cost,
        Fund_Rq: project.Fund_Rq,
        Lc_match: project.Lc_match,
        Match_Pt: project.Match_Pt,
        Comments: project.Comments
      }
    }
  }
  features.push(feature);
}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('map');
});

//Renders the new project page where PM can add projects
router.get('/new', function(req, res) {
    res.render('new-project');
});

router.get('/projects', function(req, res) {
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

//Gets all projects from the DB
// router.get('/projects', function(req, res) {
//   var featureCollection = {
//       "type": "FeatureCollection",
//       features: []
//   };
//
//   models.Funded.findAll({
//     include: [models]
//   }).then(function(allFunded) {
//     for (var i = 0; i < allFunded.length; i++) {
//       toGeoJSON(allFunded[i], featureCollection.features);
//     }
//   }).then(function() {
//     models.Unfunded.findAll({
//       include: [models]
//     }).then(function(allUnfunded) {
//       for (var i = 0; i < allUnfunded.length; i++) {
//         toGeoJSON(allUnfunded[i], featureCollection.features);
//       }
//       res.send(featureCollection);
//     });
//   });
//
// });
//
// router.get('/funded', function(req, res) {
//   var featureCollection = {
//     type: 'featureCollection',
//     features: [ ]
//   };
//   models.Funded.findAll({
//     include: [models]
//   }).then(function(allFunded) {
//     for (var i = 0; i < allFunded.length; i++) {
//       toGeoJSON(allFunded[i], featureCollection.features);
//     }
//     res.send(featureCollection);
//   });
// });
//
// router.get('/unfunded', function(req, res) {
//   var featureCollection = {
//     type: 'featureCollection',
//     features: [ ]
//   };
//   models.Unfunded.findAll({
//     include: [models]
//   }).then(function(allUnfunded) {
//     for (var i = 0; i < allUnfunded.length; i++) {
//       toGeoJSON(allUnfunded[i], featureCollection.features);
//     }
//     res.send(featureCollection);
//   });
// });

//Saves a new project to the DB
router.post('/new', function(req, res) {
    var newProject = req.body;
    var geometry = JSON.parse(newProject.Geometry);
    var coordinates = JSON.parse(geometry.coordinates);
    var parsedGeometry = {
        type: geometry.type,
        coordinates: coordinates
    }
    newProject.Geometry = parsedGeometry;
    var contactInfo = JSON.parse(newProject.Contact_info);
    newProject.Contact_info = contactInfo;
    var intersections = JSON.parse(newProject.Intersections);
    newProject.Intersections = intersections;
    models.Project.create(newProject).then(function() {
      res.send({"success": "Yes!"});
    });

    // if (newProject.Fund_St === "Funded") {
    //     models.Funded.create(newProject).then(function(newFunded) {
    //         models.create(newProject).then(function(newDetail) {
    //             newFunded.setDetail(newDetail).then(function() {
    //                 res.send({"success": "Yes!"});
    //             });
    //         });
    //     });
    // } else {
    //     models.Unfunded.create(newProject).then(function(newUnfunded) {
    //         models.create(newProject).then(function(newDetail) {
    //             newUnfunded.setDetail(newDetail).then(function() {
    //                 res.send({"success": "Yes!"});
    //             });
    //         });
    //     });
    // }
});

module.exports = router;
