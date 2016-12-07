//Global variable for creating new project
var newProject = {};

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

$(document).ready(function() {

  // Automatically hide delete and export buttons upon page load
  $("#delete").hide();
  $("#export").hide();

  // Colin's code for the form

  // Automatically hide bottom half of form and submit button
  $("#fundedAttributes").hide();
  $("#unfundedAttributes").hide();
  $("#submit").hide();
  // When click the "funded" radiobutton...
  $("#funded").on("click", function() {
      // Show submit button and appropriate form
      $("#submit").show();
      $("#unfundedAttributes").hide();
      $("#fundedAttributes").show();
  });
  // When click the "unfunded" radiobutton...
  $("#unfunded").on("click", function() {
      // Show submit button and appropriate form
      $("#submit").show();
      $("#fundedAttributes").hide();
      $("#unfundedAttributes").show();
  });


  $('#submit-project').on('click', function(){
    // Extract GeoJson from featureGroup
    var data = featureGroup.toGeoJSON();
    var fundStatus = $('#Fund_St input[type="radio"]:checked').val()

    if (fundStatus === 'Funded') {
      var newProject = {
        //Geometry
        Geometry: JSON.stringify({
          type: data.features[0].geometry.type,
          coordinates: JSON.stringify(data.features[0].geometry.coordinates)
        }),

        //Common Attributes
        UID: $('#UID').val(),
        Proj_Title: $('#Proj_Title').val(),
        Proj_Desc: $('#Proj_Desc').val(),
        Lead_Ag: $('#Lead_Ag').val(),
        Fund_St: $('#Fund_St input[type="radio"]:checked').val(),
        Proj_Man: $('#Proj_Man').val(),
        Contact_info: JSON.stringify({
          Contact_info_name: $('#Contact_info_name').val(),
          Contact_info_phone: $('#Contact_info_phone').val(),
          Contact_info_email: $('#Contact_info_email').val()
        }),
        More_info: $('#More_info').val(),
        CD: $('#CD').val(),
        Access: $('#Access input[type="radio"]:checked').val(),

        //Funded Attributes
        Dept_Proj_ID: $('#Dept_Proj_ID').val(),
        Total_bgt: parseInt($('#Total_bgt').val()).toFixed(2),
        Grant: parseInt($('#Grant').val()).toFixed(2),
        Other_funds: parseInt($('#Other_funds').val()).toFixed(2),
        Prop_c: parseInt($('#Prop_c').val()).toFixed(2),
        Measure_r: parseInt($('#Measure_r').val()).toFixed(2),
        General_fund: parseInt($('#General_fund').val()).toFixed(2),
        Current_Status: $('#Current_Status').val(),
        Issues: $('#Issues').val(),
        Deobligation: $('#Deobligation input[type="radio"]:checked').val(),
        Explanation: $('#Explanation').val(),
        Other_ID: $('#Other_ID').val(),
        Constr_by: $('#Constr_by').val(),
        Info_source: $('#Info_source').val(),

      }
    } else {

      var newProject = {
        //Geometry
        Geometry: JSON.stringify({
          type: data.features[0].geometry.type,
          coordinates: JSON.stringify(data.features[0].geometry.coordinates)
        }),

        //Common Attributes
        UID: $('#UID').val(),
        Proj_Title: $('#Proj_Title').val(),
        Proj_Desc: $('#Proj_Desc').val(),
        Lead_Ag: $('#Lead_Ag').val(),
        Fund_St: $('#Fund_St input[type="radio"]:checked').val(),
        Proj_Man: $('#Proj_Man').val(),
        Contact_info: JSON.stringify({
          Contact_info_name: $('#Contact_info_name').val(),
          Contact_info_phone: $('#Contact_info_phone').val(),
          Contact_info_email: $('#Contact_info_email').val()
        }),
        More_info: $('#More_info').val(),
        CD: $('#CD').val(),
        Access: $('#Access input[type="radio"]:checked').val(),

        //Unfunded Attributes
        Grant_Cat: $('#Grant_Cat').val(),
        Proj_Ty: $('#Proj_Ty input[type="radio"]:checked').val(),
        Est_Cost: parseInt($('#Est_Cost').val()).toFixed(2),
        Fund_Rq: parseInt($('#Fund_Rq').val()).toFixed(2),
        Lc_match: parseInt($('#Lc_match').val()).toFixed(2),
        Match_Pt: $('#Match_Pt').val(),
        Comments: $('#Comments').val()

      }
    }
    console.log(newProject);
        $.ajax({
            method: "POST",
            url: "/new",
            dataType: "json",
            data: newProject,
            success: function(data) {
              window.location = '/'
            }
        });
    return false;
  });
});
