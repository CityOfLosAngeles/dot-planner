//Global variable for creating new project
var intersectionCounter = 2;

//Show and hide attributes based on Funding Status
$('#Fund_St').on('click', function() {
  var fundedStatus = $('#Fund_St input[type="radio"]:checked').val();
  switch(fundedStatus) {
    case 'Funded':
    $('#fundedAndUnfundedAttributes').show();
    $('#fundedAttributes').show();
    $('#unfundedAttributes').hide();
    break;
    case 'Unfunded':
      $('#fundedAndUnfundedAttributes').show();
      $('#fundedAttributes').hide();
      $('#unfundedAttributes').show();
    break;
    case 'Idea Project':
    $('#fundedAndUnfundedAttributes').hide();
    $('#fundedAttributes').hide();
    $('#unfundedAttributes').hide();
  }
});

//Creating the map with mapbox (view coordinates are downtown Los Angeles)
var map = L.mapbox.map('map').setView([
    34.0522, -118.2437
], 14);

// TODO: Does mapbox API token expire? We probably need the city to make their own account and create a map. This is currently using Spencer's account.

L.tileLayer('https://api.mapbox.com/styles/v1/spencerc77/ciw30fzgs00ap2jpg6sj6ubnn/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3BlbmNlcmM3NyIsImEiOiJjaXczMDZ6NWwwMTgzMm9tbXR4dGRtOXlwIn0.TPfrEq5h7Iuain1LsBsC8Q', {detectRetina: true}).addTo(map);

//Adding a feature group to the map
var featureGroup = L.featureGroup().addTo(map);

//Add the drawing tool to the map passing in the above options as an argument
var drawControlFull = new L.Control.Draw({
  edit: {
      featureGroup: featureGroup, //REQUIRED!!,
      edit: false,
      remove: false
  }
}).addTo(map);

//This is a workaround to allow only one shape to be drawn and exported. When a shape is finished the drawControlFull is removed from the map and this edit only tool is rendered instead.
var drawControlEditOnly = new L.Control.Draw({
    edit: {
        featureGroup: featureGroup,
        edit: false,
        remove: false
    },
    draw: false
});

//When a shape is created add it to the map and remove the full drawing tool from the map and replace it with an edit only version so that only one shape can be drawn and exported
map.on(L.Draw.Event.CREATED, function(e) {
  featureGroup.addLayer(e.layer);
  drawControlFull.removeFrom(map);
  drawControlEditOnly.addTo(map);

  // Show shape submit buttons when created
  $("#delete-button").show();
});

//If the delete button is clicked remove the shape from the map and put the full drawing tool back on the map
$('#delete-button').on('click', function(e) {
  featureGroup.clearLayers();
  drawControlEditOnly.removeFrom(map);
  drawControlFull.addTo(map);
  $('#delete-button').hide();
});

var defaultBounds = new google.maps.LatLngBounds(
  new google.maps.LatLng(34.0522, -118.2437)
);

var googleOptions = {
  location: defaultBounds,
  types: ['address']
};

var primary = document.getElementById('Primary_Street');
autocomplete = new google.maps.places.Autocomplete(primary, googleOptions);

var cross1 = document.getElementById('cross-street1');
autocomplete = new google.maps.places.Autocomplete(cross1, googleOptions);

var cross2 = document.getElementById('cross-street2');
autocomplete = new google.maps.places.Autocomplete(cross2, googleOptions);

$('#submit-project').on('click', function(){

  //Extract geoJSON from the featureGroup
  var data = featureGroup.toGeoJSON();

  //Check to make sure a feature was drawn on the map
  if (data.features.length >= 1) {

    //Check the fund status of the new project
    var fundStatus = $('#Fund_St input[type="radio"]:checked').val();

    //Push all the intersections into an array
    var interArr = [ ];
    $('.Intersections').each(function() {
      interArr.push($(this).val());
    });

    //Create the newProject object and set common attributes
    var newProject = {
      //Geometry
      Geometry: JSON.stringify({
        type: data.features[0].geometry.type,
        coordinates: JSON.stringify(data.features[0].geometry.coordinates)
      }),
      //Common Attributes
      Fund_St: $('#Fund_St input[type="radio"]:checked').val(),
      Legacy_ID: $('#Legacy_ID').val(),
      Lead_Ag: $('#Lead_Ag').val(),
      Proj_Title: $('#Proj_Title').val(),
      Proj_Ty: $('#Proj_Ty input[type="radio"]:checked').val(),
      Proj_Desc: $('#Proj_Desc').val(),
      More_info: $('#More_info').val(),
      Contact_info: JSON.stringify({
        Contact_info_name: $('#Contact_info_name').val(),
        Contact_info_phone: $('#Contact_info_phone').val(),
        Contact_info_email: $('#Contact_info_email').val()
      })
    }

    //Funded and Unfunded but NOT Idea Attributes
    if (fundStatus != 'Idea Project') {
      newProject.Primary_Street = $('#Primary_Street').val();
      newProject.Cross_Streets =  JSON.stringify({
        Intersections: interArr
      });
      newProject.CD = $('#CD').val();
      newProject.Proj_Status = $('#Proj_Status').val();
      newProject.Proj_Man = $('#Proj_Man').val();
    }

    if (fundStatus === 'Funded') {
      newProject.Dept_Proj_ID = $('#Dept_Proj_ID').val();
      newProject.Other_ID = $('#Other_ID').val();
      newProject.Total_bgt = parseInt($('#Total_bgt').val()).toFixed(2);
      newProject.Grant = parseInt($('#Grant').val()).toFixed(2);
      newProject.Other_funds = parseInt($('#Other_funds').val()).toFixed(2);
      newProject.Prop_c = parseInt($('#Prop_c').val()).toFixed(2);
      newProject.Measure_r = parseInt($('#Measure_r').val()).toFixed(2);
      newProject.Gas_Tax = parseInt($('#Gas_tax').val()).toFixed(2);
      newProject.General_fund = parseInt($('#General_fund').val()).toFixed(2);
      newProject.Authorization = $('#Authorization').val();
      newProject.Issues = $('#Issues').val();
      newProject.Deobligation = $('#Deobligation input[type="radio"]:checked').val();
      newProject.Explanation = $('#Explanation').val();
      newProject.Constr_by = $('#Constr_by').val();
      newProject.Info_source = $('#Info_source').val();
      newProject.Access = $('#Access input[type="radio"]:checked').val();
    }

    //Unfunded Attributes
    if (fundStatus === 'Unfunded') {
      newProject.Grant_Cat = $('#Grant_Cat').val();
      newProject.Grant_Cycle = $('#Grant_Cycle').val();
      newProject.Est_Cost = parseInt($('#Est_Cost').val()).toFixed(2);
      newProject.Fund_Rq = parseInt($('#Fund_Rq').val()).toFixed(2);
      newProject.Lc_match = parseInt($('#Lc_match').val()).toFixed(2);
      newProject.Match_Pt = $('#Match_Pt').val();
    }

    $.ajax({
        method: "POST",
        url: "/projects/new",
        dataType: "json",
        data: newProject,
        success: function(data) {
          window.location = '/'
        }
    });

    $.ajax({
      method: "GET",
      url: "/projects/all",
      success: function(projects) {

        var possibleDuplicates = [];

        // Check for duplicates
        for(var i=0; i<projects.features.length; i++){
          if(newProject.Proj_Title.toLowerCase() == projects.features[i].properties.Proj_Title.toLowerCase() || newProject.Proj_Desc.toLowerCase() == projects.features[i].properties.Proj_Desc.toLowerCase() || newProject.Intersections == projects.features[i].properties.Intersections || newProject.More_info.toLowerCase() == projects.features[i].properties.More_info.toLowerCase())
            possibleDuplicates.push(projects.features[i]);
        }

        // If there are duplicates...
        if (possibleDuplicates.length > 0){
          for(var i=0; i<possibleDuplicates.length; i++){
            $('#duplicateProjects').append('<div id="duplicate' + i + '">Project Title: ' + possibleDuplicates[i].properties.Proj_Title + '</div>');
            $('#duplicateProjects').append('<br>');
          }
          $('#myModal').modal();
        }

        // If there are no duplicates...
        else{
          addProject(newProject);
        }
      }
    });

    return false;

  } else {

    // TODO: change this to a modal or something else nicer than an alert
    alert('Oops it looks like you forgot to add geometry to the map.');
    return false;
  }
});

//Add more intersections
$('#add-intersection').on('click', function() {
  intersectionCounter++;
  var input = $('<input class="form-control">');
  input.addClass('Intersections');
  input.attr('placeholder', 'Cross Street ' + intersectionCounter);
  input.attr('id', 'cross-street' + intersectionCounter);
  $('#intersections').append(input);
  var input = document.getElementById('cross-street' + intersectionCounter);
  autocomplete = new google.maps.places.Autocomplete(input, googleOptions);
  $('#undo-intersection').show();
});

$("#undo-intersection").on('click', function() {
  $('#cross-street' + intersectionCounter).remove();
  intersectionCounter--;
  if (intersectionCounter === 2) {
    $('#undo-intersection').hide();
  }
});

//Hide the google dropdown when the page is scrolled
$('#sidebar').on('scroll', function() {
    $('.Intersections').blur();
});

//
// // Form validation
// // ===============
//
// var uidComplete = false;
// var proj_titleComplete = false;
// var proj_descComplete = false;
// var lead_agComplete = false;
// var fund_stComplete = false;
// var proj_manComplete = false;
// var contact_info_nameComplete = false;
// var contact_info_phoneComplete = false;
// var contact_info_emailComplete = false;
// var more_infoComplete = false;
// var cdComplete = false;
// var accessComplete = false;
//
// // Unique ID
// // =========
// // HTML type = number
// // Required
// // Is a number
// $("#UID").keyup(function(){
//   if($("#UID").val() != "" && $.isNumeric($("#UID").val())){
//     uidComplete = true;
//     hasSuccess("#UID-group","#UID-span");
//   }
//   else{
//     uidComplete = false;
//     hasError("#UID-group","#UID-span");
//   }
//   checkForm();
// });
//
// // Project Title
// // =============
// // HTML type = text
// // Required
// $("#Proj_Title").keyup(function(){
//   if($("#Proj_Title").val() != ""){
//     proj_titleComplete = true;
//     hasSuccess("#Proj_Title-group","#Proj_Title-span");
//   }
//   else{
//     proj_titleComplete = false;
//     hasError("#Proj_Title-group","#Proj_Title-span");
//   }
//   checkForm();
// });
//
// // Project Description
// // ===================
// // Required
// $("#Proj_Desc").keyup(function(){
//   if($("#Proj_Desc").val() != ""){
//     proj_descComplete = true;
//     hasSuccess("#Proj_Desc-group","#Proj_Desc-span");
//   }
//   else{
//     proj_descComplete = false;
//     hasError("#Proj_Desc-group","#Proj_Desc-span");
//   }
//   checkForm();
// });
//
//
//
//
// //  TODO :  ADD INTERSECTION FORM VALIDATION AND MAKE REQUIRED
//
//
//
//
// // Lead Agency
// // ===========
// // HTML type = text
// // Required
// $("#Lead_Ag").keyup(function(){
//   if($("#Lead_Ag").val() != ""){
//     lead_agComplete = true;
//     hasSuccess("#Lead_Ag-group","#Lead_Ag-span");
//   }
//   else{
//     lead_agComplete = false;
//     hasError("#Lead_Ag-group","#Lead_Ag-span");
//   }
//   checkForm();
// });
//
// // Project Manager
// // ===============
// // HTML type = text
// // Required
// $("#Proj_Man").keyup(function(){
//   if($("#Proj_Man").val() != ""){
//     proj_manComplete = true;
//     hasSuccess("#Proj_Man-group","#Proj_Man-span");
//   }
//   else{
//     proj_manComplete = false;
//     hasError("#Proj_Man-group","#Proj_Man-span");
//   }
//   checkForm();
// });
//
// // Project Contact Information: Name
// // =================================
// // HTML type = text
// // Required
// $("#Contact_info_name").keyup(function(){
//   if($("#Contact_info_name").val() != ""){
//     contact_info_nameComplete = true;
//     hasSuccess("#Contact_info_name-group","#Contact_info_name-span");
//   }
//   else{
//     contact_info_nameComplete = false;
//     hasError("#Contact_info_name-group","#Contact_info_name-span");
//   }
//   checkForm();
// });
//
// // Project Contact Information: Phone Number
// // =========================================
// // HTML type = tel
// // Required
// // Regex expression
// $("#Contact_info_phone").keyup(function(){
//   if($("#Contact_info_phone").val() != "" && $("#Contact_info_phone").val().match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)){
//     contact_info_phoneComplete = true;
//     hasSuccess("#Contact_info_phone-group","#Contact_info_phone-span");
//   }
//   else{
//     contact_info_phoneComplete = false;
//     hasError("#Contact_info_phone-group","#Contact_info_phone-span");
//   }
//   checkForm();
// });
//
// // Project Contact Information: Email
// // ==================================
// // HTML type = email
// // Required
// // Contains these symbols: @., but not in succession
// // Greater than 5 characters
// // Contains no spaces
// // Regex express
// $("#Contact_info_email").keyup(function(){
//   if($("#Contact_info_email").val() != "" && $("#Contact_info_email").val().includes("@") && $("#Contact_info_email").val().includes(".") && $("#Contact_info_email").val().length > 5 && $("#Contact_info_email").val().indexOf("@.") == -1 && $("#Contact_info_email").val().indexOf(" ")==-1 && $("#Contact_info_email").val().match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
//     contact_info_emailComplete = true;
//     hasSuccess("#Contact_info_email-group","#Contact_info_email-span");
//   }
//   else{
//     contact_info_emailComplete = false;
//     hasError("#Contact_info_email-group","#Contact_info_email-span");
//   }
//   checkForm();
// });
//
// // Link to More Project Info
// // =========================
// // HTML type = url
// // Required
// // Contains the symbol: .
// // Contains no spaces
// // Regex expression
// $("#More_info").keyup(function(){
//   if($("#More_info").val() != "" && $("#More_info").val().includes(".") && $("#More_info").val().indexOf(" ")==-1 && $("#More_info").val().match(/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i)){
//     more_infoComplete = true;
//     hasSuccess("#More_info-group","#More_info-span");
//   }
//   else{
//     more_infoComplete = false;
//     hasError("#More_info-group","#More_info-span");
//   }
//   checkForm();
// });
//
// // Council District Number
// // =======================
// // HTML type = number
// // Required
// // Is numeric
// // Is between [1, 14]
// $("#CD").keyup(function(){
//   if($("#CD").val() != "" && $.isNumeric($("#CD").val()) && $("#CD").val()>=1 && $("#CD").val()<=14){
//     cdComplete = true;
//     hasSuccess("#CD-group","#CD-span");
//   }
//   else{
//     cdComplete = false;
//     hasError("#CD-group","#CD-span");
//   }
//   checkForm();
// });
//
// $("#internal").on("click", function() {
//     accessComplete = true;
//     checkForm();
// });
//
// $("#external").on("click", function() {
//     accessComplete = true;
//     checkForm();
// });
//
// $("#subject_to_change").on("click", function() {
//     accessComplete = true;
//     checkForm();
// });
//


// Modal onclicks
$("#flag-button").on("click", function() {

});

$("#add-button").on("click", function() {
  addProject(newProject);
});


function checkForm(){
  if(uidComplete && proj_titleComplete && proj_descComplete && lead_agComplete && fund_stComplete && proj_manComplete && contact_info_nameComplete && contact_info_phoneComplete && contact_info_emailComplete && more_infoComplete && cdComplete && accessComplete)
    $("#submit-project").removeAttr("disabled");
  else
    $("#submit-project").attr("disabled",true);
}

function hasSuccess(divID,spanID){
  $(divID).removeClass("has-error has-feedback");
  $(divID).addClass("has-success has-feedback");
  $(spanID).removeClass("glyphicon glyphicon-remove form-control-feedback");
  $(spanID).addClass("glyphicon glyphicon-ok form-control-feedback");
}

function hasError(divID,spanID){
  $(divID).removeClass("has-success has-feedback");
  $(divID).addClass("has-error has-feedback");
  $(spanID).removeClass("glyphicon glyphicon-ok form-control-feedback");
  $(spanID).addClass("glyphicon glyphicon-remove form-control-feedback");
}

function addProject(project){
  $.ajax({
    method: "POST",
    url: "/new",
    dataType: "json",
    data: project,
    success: function(data) {
      window.location = '/'
    }
  });
}
