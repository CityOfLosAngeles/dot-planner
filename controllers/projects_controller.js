var express = require('express');
var router = express.Router();
var models = require('../models');
var moment = require('moment');


//function to convert row from db into geoJSON feature
function toGeoJSON(project, features) {
  var feature = {
    type: "Feature",
    geometry: project.Geometry,
    properties: project
  }
  features.push(feature)
}

//Renders the new project page where logged in users can add projects
//If user is not logged in they are redirected to the home page
router.get('/new', function(req, res) {
    if (req.session.logged_in){
        res.render('projects/new-project', {
            logged_in: req.session.logged_in,
            adminclearance: req.session.adminclearance,
            id: req.session.user_id,
            email: req.session.email,
            firstname: req.session.firstname,
            lastname: req.session.lastname,
            phonenumber: req.session.phonenumber,
            admin: req.session.admin
        });
    }
    else {
        res.redirect("/");
    }
});

//Returns ALL projects from the DB
router.get('/all', function(req, res) {
    //Create an empty geoJSON feature collections
    //The features array will be populated when toGeoJSON is run
    var featureCollection = {
        "type": "FeatureCollection",
        features: []
    };
    //If the user is logged in return all projects
    if (req.session.logged_in) {
      models.Project.findAll().then(function(projects) {
          for (var i = 0; i < projects.length; i++) {
              toGeoJSON(projects[i], featureCollection.features);
          }
      }).then(function() {
          res.send(featureCollection);
      });
      //If the user is not logged in return all projects where Access is public
    } else {
      models.Project.findAll({
        where: {
          Access: 'Public'
        }
      }).then(function(projects) {
          for (var i = 0; i < projects.length; i++) {
              toGeoJSON(projects[i], featureCollection.features);
          }
      }).then(function() {
          res.send(featureCollection);
      });
    }
});

//Endpoint to get projects by specific funding and project types
router.get('/funding/:status/type/:type', function(req, res) {
  //Create an empty geoJSON feature collections
  //The features array will be populated when toGeoJSON is run
    var featureCollection = {
        "type": "FeatureCollection",
        features: []
    };
    //get the funding statuses requested
    var status = req.params.status;
    //get the project types requested
    var type = req.params.type;
    //string manipulations to separate funding and project types into arrays
    status = status.split('&');
    type = type.split('&');
    //create the search array that sequelize while use as the $or parameter
    var searchArr = [];

    //If the user is logged in
    if (req.session.logged_in) {
      for (var i = 0; i < status.length; i++) {
          for (var j = 0; j < type.length; j++) {
              var searchObj = {
                  Fund_St: {
                      ilike: status[i]
                  },
                  Proj_Ty: {
                      ilike: type[j]
                  }
              };
              searchArr.push(searchObj);
          }
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

      //If the user is not logged in only return publicy accessible projects
    } else {
      for (var i = 0; i < status.length; i++) {
          for (var j = 0; j < type.length; j++) {
              var searchObj = {
                  Fund_St: {
                      ilike: status[i]
                  },
                  Proj_Ty: {
                      ilike: type[j]
                  },
                  Access: 'Public'
              };
              searchArr.push(searchObj);
          }
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
    }
});



// Route to get all projects of a certain type

//Endpoint to get projects by specific funding and project types
router.get('/type/:type', function(req, res) {
    //Create an empty geoJSON feature collections
    //The features array will be populated when toGeoJSON is run
    var featureCollection = {
        "type": "FeatureCollection",
        features: []
    };
    //get the project types requested
    var type = req.params.type;
    //string manipulations to separate funding and project types into arrays
    type = type.split('&');
    console.log("TYPE: ", type);
    //create the search array that sequelize while use as the $or parameter
    var searchArr = [];

    //If the user is logged in
    if (req.session.logged_in) {
        for (var j = 0; j < type.length; j++) {
            var searchObj = {
                Proj_Ty: {
                    ilike: type[j]
                }
            };
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

        //If the user is not logged in only return publicy accessible projects
    } else {
        for (var i = 0; i < status.length; i++) {
            for (var j = 0; j < type.length; j++) {
                var searchObj = {
                    Proj_Ty: {
                        ilike: type[j]
                    },
                    Access: 'Public'
                };
                searchArr.push(searchObj);
            }
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
    }
});

//Saves a new project to the DB only if user is logged in
router.post('/new', function(req, res) {
    //If the user is logged in
    if (req.session.logged_in) {
      //req.body is does not come as a native object and therefore does not have Object.prototype methods
      //This is a work around to assign it as an object so we can use prototype methods below
      var newProject = JSON.parse(JSON.stringify(req.body));
      //Parse the projects geometry which was stringified on the front end
      var geometry = JSON.parse(newProject.Geometry);
      var coordinates = JSON.parse(geometry.coordinates);
      var parsedGeometry = {
          type: geometry.type,
          coordinates: coordinates
      }
      newProject.Geometry = parsedGeometry;
      //Parse the contact info
      var contactInfo = JSON.parse(newProject.Contact_info);
      newProject.Contact_info = contactInfo;
      //Check if the project has cross streets
      if (newProject.hasOwnProperty('Cross_Streets')) {
        //parse the cross streets
        var crossStreets = JSON.parse(newProject.Cross_Streets);
        newProject.Cross_Streets = crossStreets;
      }
      //If newProject has the propery flagged then the user has already chosen to flag it true or false
      if (newProject.hasOwnProperty('Flagged')) {
        models.Project.create(newProject).then(function() {
            res.send({"status": "saved"});
        });

        //If newProject does not have property flagged then check the db for potential duplicates
      } else {
        var searchArr = [
          {
            "Proj_Title": {
              ilike: newProject.Proj_Title
            }
          },
          {
            "Proj_Desc": {
              ilike: newProject.Proj_Desc
            }
          },
          {
            "More_info": {
              ilike: newProject.More_info
            }
          }
        ]
        models.Project.findAll({
            where: {
                $or: searchArr
            }
        }).then(function(projects) {
          //If more than more projects is returned there is a potential duplicate
          //The response tells the front end that there is a potential duplicate and passes the potential duplicate id
          if (projects && projects.length >= 1) {
            res.send({'status': 'duplicate', 'id': projects[0].id});
            //If there is no potential duplicate then save to the db
          } else {
            models.Project.create(newProject).then(function() {
                res.send({"status": "saved"});
            });
          }
        });
      }
    }
    else {
        res.redirect("/");
    }
});

//route to render the edit page
router.get('/edit/:id', function(req, res) {
    if (req.session.logged_in) {
        var id = req.params.id;
        //Check to make sure the project exists before rendering the page
        models.Project.findAll({
            where: {
                id: id
            }
        }).then(function(project) {
            //If the project exists and the user is logged in render the edit page
            if (project.length === 1) {
                res.render('projects/edit',
                {
                  id: id,
                  logged_in: req.session.logged_in,
                  adminclearance: req.session.adminclearance,
                  id: req.session.user_id,
                  email: req.session.email,
                  firstname: req.session.firstname,
                  lastname: req.session.lastname,
                  phonenumber: req.session.phonenumber,
                  admin: req.session.admin
                });
            } else {
                //If the project doesn't exist render the error page
                res.render('error', {
                    "message": "404",
                    "error": {
                        "status": "Not Found",
                        "stack": "It looks like the project you are looking for does not exist."
                    }
                });
            }
        });
    }
    else {
        res.redirect("/");
    }
});


//Route to get one single project by its db id
router.get('/id/:id', function(req, res) {
    var id = req.params.id;
    if (req.session.logged_in) {
      models.Project.findAll({
          where: {
              id: id
          }
      }).then(function(project) {
          res.send(project);
      });
    } else{
      //If the user is not logged in make sure the project is publicly accessible
      models.Project.findAll({
          where: {
              id: id,
              Access: 'Public'
          }
      }).then(function(project) {
          //If the project is publicly accessible return it
          if (project && project.length >= 1) {
            res.send(project);
          } else {
            //If the project is not publicly accessible return an error to the user
            res.render('error', {
                "message": "404",
                "error": {
                    "status": "Not Found",
                    "stack": "Either the project you're looking for doesn't exist or you do not have permission to view it."
                }
            });
          }
      });
    }
});

//Route to delete a project by its id. Only logged in users can do this
router.delete('/id/:id', function(req, res) {
    if (req.session.logged_in) {
      var id = req.params.id;
      models.Project.destroy({
        where: {
          id: id
        }
      }).then(function() {
        //After the project is deleted redirect to the table view page
        res.redirect('/projects/table');
      });
    }
    else {
        res.redirect("/");
    }
});

//Route to get projects by multiple ids
router.get('/ids/:id', function(req, res) {

  //Define a geoJSON feature collection. Features will get pushes to this when toGeoJSON is run
  var featureCollection = {
      "type": "FeatureCollection",
      features: []
  };

  var searchArr = [ ];

  //Get the IDs and split them into an array
  var id = req.params.id;
  id = id.split('&');

  if (req.session.logged_in) {
    //Create the search array that sequelize will use with the $or operator
    for (var i = 0; i < id.length; i++) {
      var searchObj = {
        id: id[i]
      }
      searchArr.push(searchObj);
    }
    //If the user is not logged in only return publicy accessible projects
  } else {
    //Create the search array that sequelize will use with the $or operator
    for (var i = 0; i < id.length; i++) {
      var searchObj = {
        id: id[i],
        Access: 'Public'
      }
      searchArr.push(searchObj);
    }
  }
  //Get all the projects and return them as geoJSON
  models.Project.findAll({
      where: {
          $or: searchArr
      }
  }).then(function(projects) {
    for (var i = 0; i < projects.length; i++) {
      toGeoJSON(projects[i], featureCollection.features);
    }
  }).then(function() {
    res.send(featureCollection);
  });
});

//Route to edit a single project
router.put('/edit/:id', function(req, res) {
  if (req.session.logged_in) {
    var id = req.params.id;
    //req.body is does not come as a native object and therefore does not have Object.prototype methods
    //This is a work around to assign it as an object so we can use prototype methods below
    var newProject = JSON.parse(JSON.stringify(req.body));
    var geometry = JSON.parse(newProject.Geometry);
    var coordinates = JSON.parse(geometry.coordinates);
    var parsedGeometry = {
        type: geometry.type,
        coordinates: coordinates
    }
    newProject.Geometry = parsedGeometry;
    var contactInfo = JSON.parse(newProject.Contact_info);
    newProject.Contact_info = contactInfo;
    if(newProject.hasOwnProperty('Cross_Streets')) {
        var crossStreets = JSON.parse(newProject.Cross_Streets);
        newProject.Cross_Streets = crossStreets;
    }
    models.Project.update(newProject, {
        where: {
            id: id
        }
    }).then(function() {
        res.send({"success": 200});
    });
  }
});

router.get('/table', function(req, res) {
  //If a user is logged in render the table page with all projects
  if (req.session.logged_in) {
    models.Project.findAll().then(function(projects) {
      res.render('projects/table',
          {
          projects: projects,
          logged_in: req.session.logged_in,
          adminclearance: req.session.adminclearance,
          id: req.session.user_id,
          email: req.session.email,
          firstname: req.session.firstname,
          lastname: req.session.lastname,
          phonenumber: req.session.phonenumber,
          admin: req.session.admin,
          projects: projects
      });
    });
    //If a user is not logged in render the table page with only publicly accessible projects
  } else {
    models.Project.findAll({
      where: {
        Access: 'Public'
      }
    }).then(function(projects) {
      res.render('projects/table',
          {
          projects: projects,
          logged_in: req.session.logged_in,
          adminclearance: req.session.adminclearance,
          id: req.session.user_id,
          email: req.session.email,
          firstname: req.session.firstname,
          lastname: req.session.lastname,
          phonenumber: req.session.phonenumber,
          admin: req.session.admin,
          projects: projects
      });
    });
  }
});

//Route to get all projects that have been flagged as potential duplicates
router.get('/flagged', function(req, res) {
  if (req.session.logged_in) {
    var dupIDArr = [ ];
    //Find all flagged projects
    models.Project.findAll({
      where: {
        Flagged: true
      }
    }).then(function(flagged) {
      //Create an array with all of the duplicate IDs(the original project that the flagged project is similar to)
      for (var i = 0; i < flagged.length; i++) {
        var obj = {
          id: flagged[i].Dup_ID
        }
        dupIDArr.push(obj);
      }
      models.Project.findAll({
        where: {
            $or: dupIDArr
        }
      }).then(function(duplicates){
        res.render('projects/flagged', {
          flagged: flagged,
          duplicates: duplicates,
          logged_in: req.session.logged_in,
          adminclearance: req.session.adminclearance,
          id: req.session.user_id,
          email: req.session.email,
          firstname: req.session.firstname,
          lastname: req.session.lastname,
          phonenumber: req.session.phonenumber,
          admin: req.session.admin
        });
      });
    });
  } else {
    res.redirect('/');
  }
});

//Route to search db for a keyword or phrase
//Area of interest: Router Area that uses 
router.get('/search', function(req, res) {
  var search = req.query.search;
  var searchObj; 
  //If the user is logged in return all results that match the search terms
  if (req.session.logged_in) {
    searchObj = {
      $or: [
        {
          Proj_Title: {
            ilike: '%' + search + '%'
          }
        },
        {
          Proj_Desc: {
            ilike: '%' + search + '%'
          }
        },
        {
          More_info: {
            ilike: '%' + search + '%'
          }
        },
        {
          Issues: {
            ilike: '%' + search + '%'
          }
        },
        {
          Info_source: {
            ilike: '%' + search + '%'
          }
        },
        {
          Primary_Street: {
            ilike: '%' + search + '%'
          }
        }
      ]
    };
    //If the user is not logged in return only publicly available projects that match the search terms
  } else {
    searchObj = {
      $or: [
        {
          Proj_Title: {
            ilike: '%' + search + '%'
          }
        },
        {
          Proj_Desc: {
            ilike: '%' + search + '%'
          }
        },
        {
          More_info: {
            ilike: '%' + search + '%'
          }
        },
        {
          Issues: {
            ilike: '%' + search + '%'
          }
        },
        {
          Info_source: {
            ilike: '%' + search + '%'
          }
        },
        {
          Primary_Street: {
            ilike: '%' + search + '%'
          }
        }
      ],
    Access: 'Public'
    }
  }
  models.Project.findAll({
    where: searchObj
  }).then(function(projects) {
    res.render('projects/search',
    {
      projects: projects,
      logged_in: req.session.logged_in,
      adminclearance: req.session.adminclearance,
      id: req.session.user_id,
      email: req.session.email,
      firstname: req.session.firstname,
      lastname: req.session.lastname,
      phonenumber: req.session.phonenumber,
      admin: req.session.admin
    });
  });
});

  router.post('/upload', function(req,res){
    if (!req.files) {
    res.send('No files were uploaded');
    return;
  }

  var fileAttachment = req.files.attachment;
  var fname = __dirname;
  fname += '/uploads/';
  fname += moment().format('YYYY-MM-DD_kkmmss_');
  fname += fileAttachment.name.split(' ').join('_');

  fileAttachment.mv(fname, function(err) {
      if (err) {
        res.status(500).send(err);
      }

      else {
        res.send(JSON.stringify({"origFileName": fileAttachment.name, "fileName": fname.split(__dirname + "/uploads/")[1]}));
      }
    });
  });

module.exports = router;
