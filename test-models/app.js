var models  = require('./models');

models.Project.create({
    ProjectTitle: "UCLA",
   ProjectDesc: "better streets",
   Funded: true,
   Geotype: "point"
 })
 // connect the .create to this .then
 .then(function(project) {
   console.log(project);
   // res.redirect('/');
 });