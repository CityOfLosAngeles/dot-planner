var models = require('../models');
var express = require('express');
var router = express.Router();

// map homepage
router.get('/', function(req, res) {
  	res.render('map', {
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

//redirect to users sign in
router.get('/signin', function(req, res) {
  res.redirect('/users/signin');
});

//sign out destroys session
router.get('/signout', function(req,res) {
	req.session.destroy(function(err) {
		res.redirect('/');
	});
});

module.exports = router;