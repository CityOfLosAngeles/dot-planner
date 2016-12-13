var fs = require('fs');
var models = require("../models");
var config = require('./config.js');
var parseGeometry = require('./geometry.js');
var pg = require('pg');


var client = new pg.Client(config);
client.connect(function(err) {
	if (err) console.log(err);

	client.query('SELECT *, ST_AsText(shape) FROM sde.uflines', function (err, result) {
	    if (err) throw err;
	    // console.log(result.rows[0]);
	    for (let i = 0; i < result.rows.length; i++) {
	    	var curElmnt = result.rows[i];
	    	// var newProject = {};

	    	// newProject.Proj_Title = curElmnt['project_ti'];
	    	// newProject.Proj_Desc = curElmnt['scope__sum'];
	    	// newProject.Geometry = parseGeometry(curElmnt['st_astext']);
	    	
	    	// Sequelize Prep TODO: Finalize Fields
	    	let newProject = {
			    Geometry: parseGeometry(curElmnt['st_astext']),
			    Fund_St: curElmnt['funding_status'],
			    Legacy_ID: parseInt(curElmnt['uid_12']),
			    Lead_Ag: null,
			    Proj_Title: curElmnt['project_ti'],
			    Proj_Ty: null,
			    Proj_Desc: curElmnt['scope__sum'],
			    Contact_info: {
			          Contact_info_name: "TBD",
			          Contact_info_phone: "TBD",
			          Contact_info_email: "TBD"
			        },
			    More_info: curElmnt['other_info'],
			    Primary_Street: curElmnt['primary_st'],
			    Cross_Streets: [curElmnt['cross_stre'], curElmnt['cross_st_1']],
			    Proj_Status: curElmnt['current_st'],
			    Proj_Man: curElmnt['project_ma'],
			    CD: parseInt(curElmnt['cd']),
			    Access: curElmnt['accessibil'],
			    Dept_Proj_ID: curElmnt[' dept_proj_'],
			    Other_ID: curElmnt['other_proj'],
			    Total_bgt: parseFloat(curElmnt['bgt_total']),
			    Grant: parseFloat(curElmnt['grant_']),
			    Other_funds: parseFloat(curElmnt['other_fund']),
			    Prop_c:parseFloat( curElmnt['prop_c']),
			    Measure_r: parseFloat(curElmnt['measure_r']),
			    Gas_Tax: parseFloat(curElmnt['gas_tax']),
			    General_fund: parseFloat(curElmnt['general_fu']),
			    Authorization: curElmnt['authorizat'],
			    Issues: curElmnt['issues'],
			    Deobligation: curElmnt['at_risk_of'],
			    Explanation: curElmnt['explain_if'],
			    Constr_by: curElmnt['constructi'],
			    Info_source: curElmnt['source'],
			    Grant_Cat: null,
			    Grant_Cycle: null,
			    Est_Cost: null,
			    Fund_Rq: null,
			    Lc_match: parseFloat(curElmnt['total_local_match']),
			    Match_Pt: null
			}

			//Account for Black CD
			i == 63 ? newProject.CD = 0: console.log("");
			// curElmnt['cd'] == null? newProject.CD = 0: newProject.CD = parseInt(curElmnt['cd']);
			// console.log(newProject);

			models.Project.create(newProject).then(function(result) {
				// console.log("success");
			})
			.catch(function(err) {
				// console.log(err);
				fs.appendFile("./error_lines_unfunded.js", (err + "\r\n" + JSON.stringify(newProject) + "\r\n"), function(err) {
				    if(err) {
				        return console.log(err);
				    }

				    console.log("The file was saved!");
				});
			});
	    }
	 	
	    // disconnect the client 
	    client.end(function (err) {
	      if (err) throw err;
	    });
	});
});


/*
Sample Output from the Source DB
{
  objectid_1: 1,
  objectid: 1,
  begin: 'Budlong Avenue &  W Gage Ave',
  end_: 'Budlong Avenue & Exposition Blvd',
  gisid: '1',
  shape_leng: '0.03621702',
  project_ti: 'Active Streets LA - Budlong Ave BFS',
  dept_proj_: 'TBD',
  scope__sum: 'The project will build upon outreach work done with a Healthy Eating and Active Living (HEAL) grant with the LACBC and Trust South LA for the 2010 Bicycle Plan Bicycle Friendly Street (BFS) projects in South Los Angeles.  The project will include traffic',
  primary_st: 'Budlong Avenue',
  cross_stre: ' W Gage Ave',
  cross_st_1: 'Exposition Blvd',
  bgt_total: '0',
  grant_: 0,
  other_fund: 0,
  prop_c: 0,
  measure_r: '0.00000000',
  gas_tax: 0,
  general_fu: 0,
  authorizat: '2013 Express Lane',
  other_info: ' ',
  current_st: 'Pre-Design',
  issues: 'NA',
  cd: '8',
  at_risk_of: 'N',
  explain_if: ' ',
  other_proj: ' ',
  constructi: 'Contractor',
  project_ma: 'TBD',
  source: 'STPOC Project Status Report - Department of Transportation Projects for June 2, 2016 - Final',
  accessibil: 'Internal',
  project_length: '3.01374113',
  uid_12: 1,
  project_category: 'Ped and Bike',
  contact_info: 'TBD',
  total_local_match: '0.00000000',
  funding_status: 'TBD',
  report: '',
  shape: 
*/