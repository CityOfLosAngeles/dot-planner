var riskOfDeobligation;
var fundStatus = "";

var legacy_idValid = true;

// Required for all projects, so mark all as true (since all projects will have these characteristics already)
var lead_agComplete = true;
var proj_titleComplete = true;
var proj_tyComplete = true;
var proj_descComplete = true;
var fund_stComplete = true;
var contact_info_nameComplete = true;
var contact_info_phoneComplete = true;
var contact_info_emailComplete = true;
var more_infoComplete = true;

// Not required for Idea Project
// Required for Funded and Unfunded

var primary_streetComplete = false;
var proj_statusComplete = false;
var proj_manComplete = false;
var cdComplete = false;

// Not required for Unfunded and Idea Project
// Required for Funded
var accessComplete = false;
var dept_proj_idComplete = false;
var other_idComplete = false;
var total_bgtComplete = false;
var grantComplete = false;
var other_fundsComplete = false;
var prop_cComplete = false;
var measure_rComplete = false;
var gas_taxComplete = false;
var general_fundComplete = false;
var authorizationComplete = false;
var issuesComplete = false;
var deobligationComplete = false;
var constr_byComplete = false;
var info_sourceComplete = false;

// Only required if Risk of Deobligation = Yes
var explanationComplete = false;

// Not required for Funded and Idea Project
// Required for Unfunded
var grant_catComplete = false;
var grant_cycleComplete = false;
var est_costComplete = false;
var fund_rqComplete = false;
var lc_matchComplete = false;


$.ajax({
  method: "GET",
  url: "/projects/id/" + id,
  dataType: "json",
  success: function(data) {
    if (data) {
      fundStatus = data[0].Fund_St;
      
      // If project has Deobligation defined in database, means all of the Funded information is in database and may be displayed (although the project may not be currently funded)
      if(data[0].Deobligation == 'Yes'){
        
        primary_streetComplete = true;
        proj_statusComplete = true;
        proj_manComplete = true;
        cdComplete = true;

        accessComplete = true;
        dept_proj_idComplete = true;
        other_idComplete = true;
        total_bgtComplete = true;
        grantComplete = true;
        other_fundsComplete = true;
        prop_cComplete = true;
        measure_rComplete = true;
        gas_taxComplete = true;
        general_fundComplete = true;
        authorizationComplete = true;
        issuesComplete = true;
        constr_byComplete = true;
        info_sourceComplete = true;
        deobligationComplete = true;

        explanationComplete = true;
        riskOfDeobligation = true;
      } else if(data[0].Deobligation == 'No'){
        
        primary_streetComplete = true;
        proj_statusComplete = true;
        proj_manComplete = true;
        cdComplete = true;

        accessComplete = true;
        dept_proj_idComplete = true;
        other_idComplete = true;
        total_bgtComplete = true;
        grantComplete = true;
        other_fundsComplete = true;
        prop_cComplete = true;
        measure_rComplete = true;
        gas_taxComplete = true;
        general_fundComplete = true;
        authorizationComplete = true;
        issuesComplete = true;
        constr_byComplete = true;
        info_sourceComplete = true;
        deobligationComplete = true;

        riskOfDeobligation = false;
        $("#explainRiskDiv").hide();
      }

      // If project has Grant_Cat defined in database, means all of the Unfunded information is in database and may be displayed (although the project may not be currently funded)
      if (data[0].Grant_Cat != undefined) {
        
        primary_streetComplete = true;
        proj_statusComplete = true;
        proj_manComplete = true;
        cdComplete = true;

        grant_catComplete = true;
        grant_cycleComplete = true;
        est_costComplete = true;
        fund_rqComplete = true;
        lc_matchComplete = true;
      }
    }
  }
});

// Funding Status
// ==============
// Required
$("#Fund_St").on("click", ".Fund_St-option", function() {
    fundStatus = $(this).val();

    fund_stComplete = true;
    checkForm();
});

// Legacy ID
// =========
// Not required
// If written, must be numeric
$("#Legacy_ID").keyup(function() {
    if ($("#Legacy_ID").val() == "") {
        console.log($("#Legacy_ID").val());
        legacy_idValid = true;
        hasSuccess("#Legacy_ID-group", "#Legacy_ID-span");
    } else {
        if ($.isNumeric($("#Legacy_ID").val())) {
            console.log($("#Legacy_ID").val());
            legacy_idValid = true;
            hasSuccess("#Legacy_ID-group", "#Legacy_ID-span");
        } else {
            console.log("3");
            legacy_idValid = false;
            hasError("#Legacy_ID-group", "#Legacy_ID-span");
        }
    }
});

// Lead Agency
// ===========
// HTML type = text
// Required
$("#Lead_Ag").keyup(function() {
    if ($("#Lead_Ag").val() != "") {
        lead_agComplete = true;
        hasSuccess("#Lead_Ag-group", "#Lead_Ag-span");
    } else {
        lead_agComplete = false;
        hasError("#Lead_Ag-group", "#Lead_Ag-span");
    }
    checkForm();
});

// Project Title
// =============
// HTML type = text
// Required
$("#Proj_Title").keyup(function() {
    if ($("#Proj_Title").val() != "") {
        proj_titleComplete = true;
        hasSuccess("#Proj_Title-group", "#Proj_Title-span");
    } else {
        proj_titleComplete = false;
        hasError("#Proj_Title-group", "#Proj_Title-span");
    }
    checkForm();
});

// Project Type
// ============
// Required
$("#Proj_Ty").on("click", ".Proj_Ty-option", function() {
    proj_tyComplete = true;
    checkForm();
});

// Project Description
// ===================
// Required
$("#Proj_Desc").keyup(function() {
    if ($("#Proj_Desc").val() != "") {
        proj_descComplete = true;
        hasSuccess("#Proj_Desc-group", "#Proj_Desc-span");
    } else {
        proj_descComplete = false;
        hasError("#Proj_Desc-group", "#Proj_Desc-span");
    }
    checkForm();
});

// Project Contact Information: Name
// =================================
// HTML type = text
// Required
$("#Contact_info_name").keyup(function() {
    if ($("#Contact_info_name").val() != "") {
        contact_info_nameComplete = true;
        hasSuccess("#Contact_info_name-group", "#Contact_info_name-span");
    } else {
        contact_info_nameComplete = false;
        hasError("#Contact_info_name-group", "#Contact_info_name-span");
    }
    checkForm();
});

// Project Contact Information: Phone Number
// =========================================
// HTML type = tel
// Required
// Regex expression
$("#Contact_info_phone").keyup(function() {
    if ($("#Contact_info_phone").val() != "" && $("#Contact_info_phone").val().match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)) {
        contact_info_phoneComplete = true;
        hasSuccess("#Contact_info_phone-group", "#Contact_info_phone-span");
    } else {
        contact_info_phoneComplete = false;
        hasError("#Contact_info_phone-group", "#Contact_info_phone-span");
    }
    checkForm();
});

// Project Contact Information: Email
// ==================================
// HTML type = email
// Required
// Contains these symbols: @., but not in succession
// Greater than 5 characters
// Contains no spaces
// Regex express

$("#Contact_info_email").keyup(function() {
    if ($("#Contact_info_email").val() != "" 
        && $("#Contact_info_email").val().includes("@") 
        && $("#Contact_info_email").val().includes(".") 
        && $("#Contact_info_email").val().length > 5 
        && $("#Contact_info_email").val().indexOf("@.") == -1 
        && $("#Contact_info_email").val().indexOf(" ") == -1 
        && $("#Contact_info_email").val().match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        contact_info_emailComplete = true;
        hasSuccess("#Contact_info_email-group", "#Contact_info_email-span");
    } else {
        contact_info_emailComplete = false;
        hasError("#Contact_info_email-group", "#Contact_info_email-span");
    }
    checkForm();
});

// More Info / Comments
// =========================
// Required
$("#More_info").keyup(function() {
    if ($("#More_info").val() != "") {
        more_infoComplete = true;
        hasSuccess("#More_info-group", "#More_info-span");
    } else {
        more_infoComplete = false;
        hasError("#More_info-group", "#More_info-span");
    }
    checkForm();
});

// Council District Number
// =======================
// HTML type = number
// Required
// Is numeric
// Is between [1, 15]
$("#CD").keyup(function() {
    if ($("#CD").val() != "" && $.isNumeric($("#CD").val()) && $("#CD").val() >= 1 && $("#CD").val() <= 15) {
        cdComplete = true;
        hasSuccess("#CD-group", "#CD-span");
    } else {
        cdComplete = false;
        hasError("#CD-group", "#CD-span");
    }
    checkForm();
});

// Intersections
// =============
// Required
// Valid location
$("#Primary_Street").on('keyup', function(){
    if($("#Primary_Street").val() != ""){
        // check_location_valid("#Primary_Street", "#Primary_Street-group", "#Primary_Street-span");
        primary_streetComplete = true;
        hasSuccess("#Primary_Street-group", "#Primary_Street-span");
    }
    else{
        primary_streetComplete = false;
        hasError("#Primary_Street-group", "#Primary_Street-span");
    }
    checkForm();
});
$("#intersections").on('keyup', '.Intersections', function(){
  var address = $('#'+this.id).val();

  if(address != ""){
    hasSuccess("#"+this.id+"-group","#"+this.id+"-span");

    // If this intersection is a newly validated intersection...
    if(intersectionsValidated.indexOf(this.id) == -1){
      if(intersectionsValidated.length == 0 || intersectionsValidated[intersectionsValidated.length-1].substring(12) < this.id.substring(12))
        intersectionsValidated.push(this.id);
      else{
        for(var i=0; i<intersectionsValidated.length; i++){

          // Check number of cross-street and put into array in order
          if(intersectionsValidated[i].substring(12) > this.id.substring(12)){
            intersectionsValidated.splice(i, 0, this.id);

            // stop loop
            i = intersectionsValidated.length
          }
        }
      }
    }
  }
  else{
    hasError("#"+this.id+"-group","#"+this.id+"-span");
    if(intersectionsValidated.indexOf(this.id) != -1)
      intersectionsValidated.splice(intersectionsValidated.indexOf(this.id), 1);
  }
  checkForm();
  // console.log(intersectionsValidated);
});

// Project Status
// ===============
// HTML type = text
// Required
$("#Proj_Status").keyup(function(){
  if($("#Proj_Status").val() != ""){
    proj_statusComplete = true;
    hasSuccess("#Proj_Status-group","#Proj_Status-span");
  }
  else{
    proj_statusComplete = false;
    hasError("#Proj_Status-group","#Proj_Status-span");
  }
  checkForm();
});

// Project Manager
// ===============
// HTML type = text
// Required
$("#Proj_Man").keyup(function(){
  if($("#Proj_Man").val() != ""){
    proj_manComplete = true;
    hasSuccess("#Proj_Man-group","#Proj_Man-span");
  }
  else{
    proj_manComplete = false;
    hasError("#Proj_Man-group","#Proj_Man-span");
  }
  checkForm();
});

// Accessibility
// ===============
// Required
$("#Access").on("click", ".Access-option", function() {
    accessComplete = true;
    checkForm();
});

// Department Project ID
// =====================
// Required
$("#Dept_Proj_ID").keyup(function(){
  if($("#Dept_Proj_ID").val() != ""){
    dept_proj_idComplete = true;
    hasSuccess("#Dept_Proj_ID-group","#Dept_Proj_ID-span");
  }
  else{
    dept_proj_idComplete = false;
    hasError("#Dept_Proj_ID-group","#Dept_Proj_ID-span");
  }
  checkForm();
});

// Other Project ID
// ================
// Required
$("#Other_ID").keyup(function(){
  if($("#Other_ID").val() != ""){
    other_idComplete = true;
    hasSuccess("#Other_ID-group","#Other_ID-span");
  }
  else{
    other_idComplete = false;
    hasError("#Other_ID-group","#Other_ID-span");
  }
  checkForm();
});

// Total Budget
// ============
// HTML type = number
// Required
// Is numeric
$("#Total_bgt").keyup(function() {
    if ($("#Total_bgt").val() != "" && $.isNumeric($("#Total_bgt").val())) {
        total_bgtComplete = true;
        hasSuccess("#Total_bgt-group", "#Total_bgt-span");
    } else {
        total_bgtComplete = false;
        hasError("#Total_bgt-group", "#Total_bgt-span");
    }
    checkForm();
});

// Grant
// ============
// HTML type = number
// Required
// Is numeric
$("#Grant").keyup(function() {
    if ($("#Grant").val() != "" && $.isNumeric($("#Grant").val())) {
        grantComplete = true;
        hasSuccess("#Grant-group", "#Grant-span");
    } else {
        grantComplete = false;
        hasError("#Grant-group", "#Grant-span");
    }
    checkForm();
});

// Other Funds
// ===========
// HTML type = number
// Required
// Is numeric
$("#Other_funds").keyup(function() {
    if ($("#Other_funds").val() != "" && $.isNumeric($("#Other_funds").val())) {
        other_fundsComplete = true;
        hasSuccess("#Other_funds-group", "#Other_funds-span");
    } else {
        other_fundsComplete = false;
        hasError("#Other_funds-group", "#Other_funds-span");
    }
    checkForm();
});

// Prop C
// ======
// HTML type = number
// Required
// Is numeric
$("#Prop_c").keyup(function() {
    if ($("#Prop_c").val() != "" && $.isNumeric($("#Prop_c").val())) {
        prop_cComplete = true;
        hasSuccess("#Prop_c-group", "#Prop_c-span");
    } else {
        prop_cComplete = false;
        hasError("#Prop_c-group", "#Prop_c-span");
    }
    checkForm();
});

// Measure R
// =========
// HTML type = number
// Required
// Is numeric
$("#Measure_r").keyup(function() {
    if ($("#Measure_r").val() != "" && $.isNumeric($("#Measure_r").val())) {
        measure_rComplete = true;
        hasSuccess("#Measure_r-group", "#Measure_r-span");
    } else {
        measure_rComplete = false;
        hasError("#Measure_r-group", "#Measure_r-span");
    }
    checkForm();
});

// Gas Tax
// =========
// HTML type = number
// Required
// Is numeric
$("#Gas_tax").keyup(function() {
    if ($("#Gas_tax").val() != "" && $.isNumeric($("#Gas_tax").val())) {
        gas_taxComplete = true;
        hasSuccess("#Gas_tax-group", "#Gas_tax-span");
    } else {
        gas_taxComplete = false;
        hasError("#Gas_tax-group", "#Gas_tax-span");
    }
    checkForm();
});

// General Fund
// ============
// HTML type = number
// Required
// Is numeric
$("#General_fund").keyup(function() {
    if ($("#General_fund").val() != "" && $.isNumeric($("#General_fund").val())) {
        general_fundComplete = true;
        hasSuccess("#General_fund-group", "#General_fund-span");
    } else {
        general_fundComplete = false;
        hasError("#General_fund-group", "#General_fund-span");
    }
    checkForm();
});

// Authorization
// =============
// Required
$("#Authorization").keyup(function() {
    if ($("#Authorization").val() != "") {
        authorizationComplete = true;
        hasSuccess("#Authorization-group", "#Authorization-span");
    } else {
        authorizationComplete = false;
        hasError("#Authorization-group", "#Authorization-span");
    }
    checkForm();
});

// Issues
// ======
// Required
$("#Issues").keyup(function() {
    if ($("#Issues").val() != "") {
        issuesComplete = true;
        hasSuccess("#Issues-group", "#Issues-span");
    } else {
        issuesComplete = false;
        hasError("#Issues-group", "#Issues-span");
    }
    checkForm();
});

// At Risk of Deobligation?
// ========================
// Required
$("#Deobligation").on("click", ".Deobligation-option", function() {
    if($(this).val() == "Yes"){
        $("#explainRiskDiv").show();
        riskOfDeobligation = true;
    }
    else{
        $("#explainRiskDiv").hide();
        riskOfDeobligation = false;
    }

    deobligationComplete = true;
    checkForm();
});

// Explain Risk of Deobligation
// ========================
// Required
$("#Explanation").keyup(function() {
    if ($("#Explanation").val() != "") {
        explanationComplete = true;
        hasSuccess("#Explanation-group", "#Explanation-span");
    } else {
        explanationComplete = false;
        hasError("#Explanation-group", "#Explanation-span");
    }
    checkForm();
});

// Construction By
// ===============
// Required
$("#Constr_by").keyup(function() {
    if ($("#Constr_by").val() != "") {
        constr_byComplete = true;
        hasSuccess("#Constr_by-group", "#Constr_by-span");
    } else {
        constr_byComplete = false;
        hasError("#Constr_by-group", "#Constr_by-span");
    }
    checkForm();
});

// Source
// ======
// Required
$("#Info_source").keyup(function() {
    if ($("#Info_source").val() != "") {
        info_sourceComplete = true;
        hasSuccess("#Info_source-group", "#Info_source-span");
    } else {
        info_sourceComplete = false;
        hasError("#Info_source-group", "#Info_source-span");
    }
    checkForm();
});

// Source
// ======
// Required
$("#Info_source").keyup(function() {
    if ($("#Info_source").val() != "") {
        info_sourceComplete = true;
        hasSuccess("#Info_source-group", "#Info_source-span");
    } else {
        info_sourceComplete = false;
        hasError("#Info_source-group", "#Info_source-span");
    }
    checkForm();
});

// Grant Category
// ==============
// Required
$("#Grant_Cat").keyup(function() {
    if ($("#Grant_Cat").val() != "") {
        grant_catComplete = true;
        hasSuccess("#Grant_Cat-group", "#Grant_Cat-span");
    } else {
        grant_catComplete = false;
        hasError("#Grant_Cat-group", "#Grant_Cat-span");
    }
    checkForm();
});

// Grant Cycle
// ===========
// Required
$("#Grant_Cycle").keyup(function() {
    if ($("#Grant_Cycle").val() != "") {
        grant_cycleComplete = true;
        hasSuccess("#Grant_Cycle-group", "#Grant_Cycle-span");
    } else {
        grant_cycleComplete = false;
        hasError("#Grant_Cycle-group", "#Grant_Cycle-span");
    }
    checkForm();
});

// Estimated Cost
// ==============
// HTML type = number
// Required
// Is numeric
$("#Est_Cost").keyup(function() {
    if ($("#Est_Cost").val() != "" && $.isNumeric($("#Est_Cost").val())) {
        est_costComplete = true;
        hasSuccess("#Est_Cost-group", "#Est_Cost-span");
    } else {
        est_costComplete = false;
        hasError("#Est_Cost-group", "#Est_Cost-span");
    }
    checkForm();
});

// Fund Request
// ============
// HTML type = number
// Required
// Is numeric
$("#Fund_Rq").keyup(function() {
    if ($("#Fund_Rq").val() != "" && $.isNumeric($("#Fund_Rq").val())) {
        fund_rqComplete = true;
        hasSuccess("#Fund_Rq-group", "#Fund_Rq-span");
    } else {
        fund_rqComplete = false;
        hasError("#Fund_Rq-group", "#Fund_Rq-span");
    }
    checkForm();
});

// Local Match
// ===========
// HTML type = number
// Required
// Is numeric
$("#Lc_match").keyup(function() {
    if ($("#Lc_match").val() != "" && $.isNumeric($("#Lc_match").val())) {
        lc_matchComplete = true;
        hasSuccess("#Lc_match-group", "#Lc_match-span");
    } else {
        lc_matchComplete = false;
        hasError("#Lc_match-group", "#Lc_match-span");
    }
    checkForm();
});


function checkForm() {

    // Check common attributes first
    if (
      legacy_idValid
      && lead_agComplete
      && proj_titleComplete
      && proj_tyComplete
      && proj_descComplete
      && fund_stComplete
      && contact_info_nameComplete
      && contact_info_phoneComplete
      && contact_info_emailComplete
      && more_infoComplete
    ) {

        // Next check attributes specific to particular funding status
        if (
          fundStatus == 'Funded'

          && intersectionsValidated.length == intersectionCounter
          && primary_streetComplete
          && proj_statusComplete
          && proj_manComplete
          && cdComplete
          && accessComplete
          && dept_proj_idComplete
          && other_idComplete
          && total_bgtComplete
          && grantComplete
          && other_fundsComplete
          && prop_cComplete
          && measure_rComplete
          && gas_taxComplete
          && general_fundComplete
          && authorizationComplete
          && issuesComplete
          && deobligationComplete
          && constr_byComplete
          && info_sourceComplete
        ) {

          console.log(1);

          // If at risk for deobligation checked...
          if(riskOfDeobligation){
            if(explanationComplete)
              $("#update-project").removeAttr("disabled");
            else
              $("#update-project").attr("disabled", true);
          }
          else{
            $("#update-project").removeAttr("disabled");
          }
        } else if(
          fundStatus == 'Unfunded'
          && intersectionsValidated.length == intersectionCounter
          && primary_streetComplete
          && proj_statusComplete
          && proj_manComplete
          && cdComplete
          && grant_catComplete
          && grant_cycleComplete
          && est_costComplete
          && fund_rqComplete
          && lc_matchComplete
        ) {
          $("#update-project").removeAttr("disabled");
        } else if(fundStatus == 'Idea Project'){
          $("#update-project").removeAttr("disabled");
        } else {
          $("#update-project").attr("disabled", true);
        }
    } else {
        $("#update-project").attr("disabled", true);
    }
}

function hasSuccess(divID, spanID) {
    $(divID).removeClass("has-error has-feedback");
    $(divID).addClass("has-success has-feedback");
    $(spanID).removeClass("glyphicon glyphicon-remove form-control-feedback");
    $(spanID).addClass("glyphicon glyphicon-ok form-control-feedback");
}

function hasError(divID, spanID) {
    $(divID).removeClass("has-success has-feedback");
    $(divID).addClass("has-error has-feedback");
    $(spanID).removeClass("glyphicon glyphicon-ok form-control-feedback");
    $(spanID).addClass("glyphicon glyphicon-remove form-control-feedback");
}

// function check_location_valid(stringAddress, divID, spanID) {
//     var geocoder = new google.maps.Geocoder();

//     geocoder.geocode({
//         "address": stringAddress
//     }, function(results, status) {
//         if (status == google.maps.GeocoderStatus.OK) {

//             // Has success
//             $(divID).removeClass("has-error has-feedback");
//             $(divID).addClass("has-success has-feedback");
//             $(spanID).removeClass("glyphicon glyphicon-remove form-control-feedback");
//             $(spanID).addClass("glyphicon glyphicon-ok form-control-feedback");

//             primary_streetComplete = true;
//             console.log(true);
//         } else {

//             // Has error
//             $(divID).removeClass("has-success has-feedback");
//             $(divID).addClass("has-error has-feedback");
//             $(spanID).removeClass("glyphicon glyphicon-ok form-control-feedback");
//             $(spanID).addClass("glyphicon glyphicon-remove form-control-feedback");

//             primary_streetComplete = false;
//             console.log(false);
//         }
//     });
// }
