var bcrypt = require('bcryptjs');
var models  = require('../models');
var express = require('express');
var router  = express.Router();
var keepresp = [];

// dashboard
router.get('/', function(req,res) {
	models.User.findOne({
        where: {email: req.session.email}
    }).then(function(response) {
    	if (req.session.adminclearance == true) {
	    	models.User.findAll().then(function(response) {
				keepresp = [];
				for (i=0; i<response.length; i++){
					var id = response[i].dataValues.id;
					var firstname = response[i].dataValues.firstname;
					var lastname = response[i].dataValues.lastname;
					var phonenumber = response[i].dataValues.phonenumber;
					var email = response[i].dataValues.email;
					var admin = response[i].dataValues.admin;
					keepresp.push(
					{
						id: id,
						firstname: firstname,
						lastname: lastname,
						phonenumber: phonenumber,
						email: email,
						admin: admin

					});
				}
			}).then(function(){
		    	res.render('users/dashboard', {
		    		logged_in: req.session.logged_in,
				    adminclearance: req.session.adminclearance,

		    		id: req.session.user_id,
				    email: req.session.email,
				    firstname: req.session.firstname,
				    lastname: req.session.lastname,
				    phonenumber: req.session.phonenumber,
				    admin: req.session.admin,
				    data: keepresp
		    	});
		    });
		}
		else {
			res.render('users/dashboard', {
	    		logged_in: req.session.logged_in,
			    adminclearance: req.session.adminclearance,

	    		id: req.session.user_id,
			    email: req.session.email,
			    firstname: req.session.firstname,
			    lastname: req.session.lastname,
			    phonenumber: req.session.phonenumber,
			    admin: req.session.admin,
			    data: keepresp
	    	});
		}
	});
});

//sign up (only for first admin!!!)
router.get('/signup', function(req,res) {
	res.render('users/signup'
		, {
		logged_in: req.session.logged_in,
	    adminclearance: req.session.adminclearance,

		id: req.session.user_id,
	    email: req.session.email,
	    firstname: req.session.firstname,
	    lastname: req.session.lastname,
	    phonenumber: req.session.phonenumber,
	    admin: req.session.admin,
	    data: keepresp
	});
});

//sign up (only for first admin!!!)
router.get('/finishsignup', function(req,res) {
	res.render('users/finishsignup', {
		logged_in: req.session.logged_in,
	    adminclearance: req.session.adminclearance,

		id: req.session.user_id,
	    email: req.session.email,
	    firstname: req.session.firstname,
	    lastname: req.session.lastname,
	    phonenumber: req.session.phonenumber,
	    admin: req.session.admin,
	    data: keepresp
	});
});

//admin sign new people up
router.get('/adminadd', function(req,res) {
	res.render('users/adminadd', {
    		logged_in: req.session.logged_in,
		    adminclearance: req.session.adminclearance,

    		id: req.session.user_id,
		    email: req.session.email,
		    firstname: req.session.firstname,
		    lastname: req.session.lastname,
		    phonenumber: req.session.phonenumber,
		    admin: req.session.admin,
		    data: keepresp
    	});
});

//sign in
router.get('/signin', function(req,res) {
	res.render('users/signin'
		, {
		logged_in: req.session.logged_in,
	    adminclearance: req.session.adminclearance,

		id: req.session.user_id,
	    email: req.session.email,
	    firstname: req.session.firstname,
	    lastname: req.session.lastname,
	    phonenumber: req.session.phonenumber,
	    admin: req.session.admin,
	    data: keepresp
	}
	);
});

// login
router.post('/login', function(req, res) {
	models.User.findOne({
		where: {
			email: {ilike: req.body.email}
		}
	}).then(function(user) {
		if (user == null){
			res.redirect('/users/signin')
		}
		if (req.body.password == "ladot") {
			req.session.logged_in = true;
			res.redirect('/users/finishsignup');
		}
		else {
		bcrypt.compare(req.body.password, user.password_hash, function(err, result) {
        	if (result == true){
				req.session.logged_in = true;
	            req.session.firstname = user.firstname;
	            req.session.lastname = user.lastname;
	            req.session.phonenumber = user.phonenumber;
		        req.session.user_id = user.id;
		        req.session.email = user.email;
		        req.session.admin = user.admin;

		        if (user.admin == "Admin"){
		        	req.session.adminclearance = true;
		        	console.log(user.admin+" : give admin clearance");
		        	res.redirect('/users');
		        }
		        else {
		        	console.log(user.admin+" clearance; not an admin");
		        	res.redirect('/');
		        }
        	}
        	else{
        		res.redirect('/users/signin')
			}
		});
		}
	});
});

//register a user
router.post('/createuser', function(req,res) {
	models.User.findAll({
    where: {email: req.body.email}
  }).then(function(users) {
		if (users.length > 0){
			console.log(users)
			res.send('we already have an email for this account')
		}else{
			bcrypt.genSalt(10, function(err, salt) {
				bcrypt.hash(req.body.password, salt, function(err, hash) {
					models.User.create({
						firstname: req.body.firstname,
						lastname: req.body.lastname,
						phonenumber: req.body.phonenumber,
						email: req.body.email,
						admin: req.body.admin,
						password_hash: hash
					})
					.then(function(){
						res.redirect('/signin');
					});
				});
			});

		}
	});
});

// admin register a user
router.post('/admincreateuser', function(req,res) {
	models.User.findAll({
    where: {email: req.body.email}
  }).then(function(users) {
		if (users.length > 0){
			console.log(users)
			res.send('we already have an email for this account')
		}else{
			var newUser = {
				firstname: null,
				lastname: null,
				phonenumber: null,
				email: req.body.email,
				admin: req.body.admin,
				password_hash: "ladot"
			}
			models.User.create(newUser)
			.then(function(){
				keepresp.push(newUser);
				res.redirect('/users');
			});
		}
	});
});

router.post('/finishuser', function(req,res) {
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(req.body.password, salt, function(err, hash) {
			models.User.update({
				firstname: req.body.firstname,
				lastname: req.body.lastname,
				email: req.body.email,
				phonenumber: req.body.phonenumber,
				password_hash: hash
			}, {
				where: {email: req.body.email}
			})
			.then(function(){
				req.session.logged_in = false;
				res.redirect('/signin');
			});
		});
	});
});

router.post('/admindestroyuser', function(req, res) {
	console.log("will delete");
	models.User.destroy({
	    where: {email: req.body.deleteemail}
	})
	.then(function(){
		res.redirect('/users');
	});
});

module.exports = router;
