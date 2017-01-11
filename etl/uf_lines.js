var fs = require('fs');
// var models = require("../models");
var config = require('./config.js');
var parseGeometry = require('./geometry.js');
var pg = require('pg');
var projectTypes = require('./ptypes.js');


var client = new pg.Client(config);
client.connect(function(err) {
	if (err) console.log(err);

	client.query('SELECT *, ST_AsText(shape) FROM sde.uflines;', function (err, result) {
	    if (err) throw err;
	    // console.log(result.rows[0]);
	    for (let i = 0; i < result.rows.length; i++) {
	    	var curElmnt = result.rows[i];

	    	let newProject = {
			    Fund_St: "unfunded",
			    Legacy_ID: curElmnt['uid'],
			    Lead_Ag: null,
			    Proj_Title: curElmnt['project__1'],
			    Proj_Ty: projectTypes[curElmnt['project_ca']],
			    Proj_Desc: curElmnt['project_de'],
			    Contact_info: {
			          Contact_info_name: "TBD",
			          Contact_info_phone: "TBD",
			          Contact_info_email: "TBD"
			        },
			    More_info: curElmnt['notes'],
			    Primary_Street: null,
			    Cross_Streets: null,
			    Proj_Status: curElmnt['current_st'],
			    Proj_Man: "TBD",
			    CD: curElmnt['cd'],
			    Access: curElmnt['project_ac'],
			    Info_source: curElmnt['source'],
			    Dept_Proj_ID: null,
			    Other_ID: null,
			    Grant_Cat: curElmnt['grant_cate'],
			    Grant_Cycle: curElmnt['grant_cycl'],
			    Est_Cost: null,
			    Fund_Rq: null,
			    Lc_match: 0, //missing from Funded Lines standalone table
			    Match_Pt: null,

			    //Values that don't exist yet in unfunded in projects
			    // Measure_r: null,
			    // Gas_Tax: null,
			    // General_fund: null,
			    // Total_bgt: parseInt(curElmnt['bgt_total']),
			    // Grant: parseInt(curElmnt['grant_']),
			    // Other_funds: parseInt(curElmnt['other_funds']),
			    // Prop_c:parseInt(curElmnt['prop_c']),
			    // General_fund: parseInt(curElmnt['general_fund']),
			    // Authorization: curElmnt[' authorization_'],
			    // Issues: curElmnt['issues'],
			    // Deobligation: curElmnt['at_risk_of_deobligation__y_n'],
			    // Explanation: curElmnt['explain_if_at_risk'],
			    // Constr_by: curElmnt['construction_by'],
			}

			//Account for absence of shapefile
			curElmnt['st_astext'] == null ? newProject.Geometry = null: newProject.Geometry = parseGeometry(curElmnt['st_astext']);

		    //Write results to file
			fs.appendFile("./export_UNFUNDED_lines.js", JSON.stringify(newProject) + ",\r\n", function(err){
				if (err) {
					return console.log(err);
				}
			});

	    }
	 	
	    // disconnect the client 
	    client.end(function (err) {
	      if (err) throw err;
	    });
	});
});

