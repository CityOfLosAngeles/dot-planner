var newProject;

//Global variable for countering number of cross streets
var intersectionCounter = 2;

//Show and hide attributes based on Funding Status
$('#Fund_St').on('click', function() {
    var fundedStatus = $('#Fund_St input[type="radio"]:checked').val();
    switch (fundedStatus) {
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
    draw: {
        circle: false
    },
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

var defaultBounds = new google.maps.LatLngBounds(new google.maps.LatLng(34.0522, -118.2437));

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
        var interArr = [];
        $('.Intersections').each(function() {
            interArr.push($(this).val());
        });

        //Create the newProject object and set common attributes
        newProject = {
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
            Contact_info: JSON.stringify({Contact_info_name: $('#Contact_info_name').val(), Contact_info_phone: $('#Contact_info_phone').val(), Contact_info_email: $('#Contact_info_email').val()})
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
      addProject(newProject);
      return false;

    } else {

      // TODO: change this to a modal or something else nicer than an alert
      alert('Oops it looks like you forgot to add geometry to the map.');
      return false;
    }
});

function addProject(project) {
    $.ajax({
        method: "POST",
        url: "/projects/new",
        dataType: "json",
        data: project,
        success: function(data) {
          if (data.status === 'duplicate') {
            project.Dup_ID = data.id;
            $('#myModal').modal();
            $("#flag-button").on("click", function() {
              project.Flagged = true;
              addProject(project);
            });

            $("#add-button").on("click", function() {
                project.Flagged = false;
                addProject(project);
            });
          } else {
            window.location = '/';
          }
        }
    });
}

// Add more intersections
$('#add-intersection').on('click', function() {
    intersectionCounter++;

    var div = $('<div class="form-group" id="cross-street' + intersectionCounter + '-group">');

    var input = $('<input class="form-control">');
    input.addClass('Intersections');
    input.attr('placeholder', 'Cross Street ' + intersectionCounter);
    input.attr('id', 'cross-street' + intersectionCounter);

    var span = $('<span id="cross-street' + intersectionCounter + '-span" area-hidden="true">');

    div.append(input);
    div.append(span);
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

// Modal onclicks
$("#flag-button").on("click", function() {});

$("#add-button").on("click", function() {
    addProject(newProject);
});

