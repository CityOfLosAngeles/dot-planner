var fs = require('fs');
var models = require("../models");
var config = require('./config.js');
var parseGeometry = require('./geometry.js');
var pg = require('pg');

var q = "SELECT fpolygons.uid_1,  sa_fpolygons.project_title,  sa_fpolygons.project_category,  scope__sum,  sa_fpolygons.other_info,  sa_fpolygons.n,  sa_fpolygons.s,  sa_fpolygons.e,  sa_fpolygons.w,  sa_fpolygons.current_status,  sa_fpolygons.project_manager,  sa_fpolygons.cd,  sa_fpolygons.accessibility,  sa_fpolygons.dept_proj__id,  sa_fpolygons.bgt_total,  sa_fpolygons.grant_,  sa_fpolygons.other_funds,  sa_fpolygons.prop_c,  general_fu,  sa_fpolygons.authorization_,  sa_fpolygons.issues,  sa_fpolygons.at_risk_of_deobligation__y_n,  sa_fpolygons.explain_if_at_risk,  sa_fpolygons.construction_by,  sa_fpolygons.source,  sa_fpolygons.measure_r,  fpolygons.gas_tax,  sa_fpolygons.other_funds,  sa_fpolygons.contact_info,  ST_AsText(shape) FROM fpolygons LEFT JOIN sa_fpolygons ON fpolygons.uid_1=sa_fpolygons.uid;";

var client = new pg.Client(config);
client.connect(function(err) {
	if (err) console.log(err);

	client.query(q, function (err, result) {
	    if (err) throw err;
	    // console.log(result.rows[0]);
	    for (let i = 0; i < result.rows.length; i++) {
	    	var curElmnt = result.rows[i];

	    	let newProject = {
			    Fund_St: "Funded",
			    Legacy_ID: curElmnt['uid_1'],
			    Lead_Ag: null,
			    Proj_Title: curElmnt['project_title'],
			    Proj_Ty: curElmnt['project_category'],
			    Proj_Desc: curElmnt['scope__sum'],
			    Contact_info: {
			          Contact_info_name: curElmnt[' project_manager'],
			          Contact_info_phone: "TBD",
			          Contact_info_email: curElmnt['contact_info']
			        },
			    More_info: curElmnt['other_info'],
			    Primary_Street: null,
			    Cross_Streets: {"Intersections": [curElmnt['n'], curElmnt['s'], curElmnt['e'], curElmnt['w']]},
			    Proj_Status: curElmnt['current_status'],
			    Proj_Man: curElmnt[' project_manager'],
			    CD: curElmnt['cd'],
			    Access: curElmnt['accessibility'],
			    Dept_Proj_ID: curElmnt['dept_proj__id'],
			    Other_ID: curElmnt['other_project_id'],
			    Total_bgt: parseInt(curElmnt['bgt_total']),
			    Grant: parseInt(curElmnt['grant_']),
			    Other_funds: parseInt(curElmnt['other_funds']),
			    Prop_c:parseInt( curElmnt['prop_c']),
			    General_fund: parseInt(curElmnt['general_fund']),
			    Authorization: curElmnt['authorization_'],
			    Issues: curElmnt['issues'],
			    Deobligation: curElmnt['at_risk_of_deobligation__y_n'],
			    Explanation: curElmnt['explain_if_at_risk'],
			    Constr_by: curElmnt['construction_by'],
			    Info_source: curElmnt['source'],
			    Grant_Cat: null,
			    Grant_Cycle: null,
			    Est_Cost: null,
			    Fund_Rq: null,
			    Lc_match: 0, //missing from Funded Lines standalone table
			    Match_Pt: null
			}

			//Account for absence of shapefile
			curElmnt['st_astext'] == null ? newProject.Geometry = null: newProject.Geometry = parseGeometry(curElmnt['st_astext']);

			//Account for null values in measure_r
			curElmnt['measure_r'] == null ? newProject.Measure_r = 0 : newProject.Measure_r =parseInt(curElmnt['measure_r']);

			//Account for null values in gas_tax
		    curElmnt['gas_tax'] == null? newProject.Gas_Tax = 0 : newProject.Gas_Tax = parseInt(curElmnt['gas_tax']);

		    //Account for null values in general_fund
		    curElmnt['general_fund'] == null? newProject.General_fund = 0 : newProject.General_fund = parseInt(curElmnt['general_fund']);

			fs.appendFile("./export_funded_polygons.js", JSON.stringify(newProject) + ",\r\n", function(err){
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