//Global variable for creating new project
var newProject = {};

//Creating the map with mapbox (view coordinates are downtown Los Angeles)
var map = L.mapbox.map('map').setView([
    34.0522, -118.2437
], 14);
map.invalidateSize();

//If we want to include multiple map layers

// L.control.layers({
//     'Satellite Map': L.mapbox.tileLayer('bobbysud.map-l4i2m7nd', {detectRetina: true}).addTo(map),
//     'Terrain Map': L.mapbox.tileLayer('bobbysud.i2pfp2lb', {detectRetina: true})
// }).addTo(map);

//Adding the underlying map layer to the map
// L.tileLayer('https://api.mapbox.com/styles/v1/spencerc77/ciw309ms000ba2ko45wvaj6ay/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3BlbmNlcmM3NyIsImEiOiJjaXczMDZ6NWwwMTgzMm9tbXR4dGRtOXlwIn0.TPfrEq5h7Iuain1LsBsC8Q', {detectRetina: true}).addTo(map);

L.tileLayer('https://api.mapbox.com/styles/v1/spencerc77/ciw30fzgs00ap2jpg6sj6ubnn/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3BlbmNlcmM3NyIsImEiOiJjaXczMDZ6NWwwMTgzMm9tbXR4dGRtOXlwIn0.TPfrEq5h7Iuain1LsBsC8Q', {detectRetina: true}).addTo(map);

//Adding a feature group to the map
var featureGroup = L.featureGroup().addTo(map);

//AJAX request to the PostgreSQL database to get all projects and render them on the map
$.ajax({
    type: 'GET',
    url: '/projects',
    datatype: 'JSON',
    success: function(data) {
        if (data) {
            L.geoJson(data, {
                //We can use this style option to style the render shapes however we'd like
                style: function(feature) {
                    return {"color": "#78c679", "weight": 5, "opacity": 0.9}
                },
                //Function to be run any time a feature is clicked. This one presents the popup with a little bit of project information
                onEachFeature: function(feature, layer) {
                    layer.bindPopup('<h1>UID: ' + feature.properties.UID + '</h1>' + '<h1>Title: ' + feature.properties.title + '</h1>' + '<h1>Description: ' + feature.properties.description + '</h1>');
                }
            }).addTo(map);
        }
    }
});

// //Setting up the Google search box
// var GooglePlacesSearchBox = L.Control.extend({
//   onAdd: function() {
//     var element = document.createElement("input");
//     element.id = "searchBox";
//     return element;
//   }
// });
//
// //Adding the Google search box to the map
// (new GooglePlacesSearchBox).addTo(map);
//
// var input = document.getElementById("searchBox");
// var searchBox = new google.maps.places.SearchBox(input);
//
// searchBox.addListener('places_changed', function() {
//   var places = searchBox.getPlaces();
//
//   if (places.length == 0) {
//     return;
//   }
//
//   var group = L.featureGroup();
//
//   places.forEach(function(place) {
//
//     var lat = place.geometry.location.lat();
//     var long = place.geometry.location.lng();
//     console.log("lat: "+lat);
//     console.log("long: "+long);
//     var pairs = [lat, long]
//     map.setView([lat,long], 15);
//   });
//
// });

//Example of how we can style the drawing tool and shapes as they are drawn
var options = {
    position: 'topleft',
    draw: {
        polyline: {
            shapeOptions: {
                color: '#f357a1',
                weight: 10
            }
        },
        polygon: {
            allowIntersection: false, // Restricts shapes to simple polygons
            drawError: {
                color: '#e1e100', // Color the shape will turn when intersects
                message: '<strong>Sorry!<strong>you can\'t draw that!' // Message that will show when intersect
            },
            shapeOptions: {
                color: '#bada55'
            }
        },
        circle: false, // We can turn off drawing tool options
        rectangle: {
            shapeOptions: {
                clickable: false
            }
        }
    },
    edit: {
        featureGroup: featureGroup, //REQUIRED!!
        remove: false
    }
};

//Add the drawing tool to the map passing in the above options as an argument
var drawControlFull = new L.Control.Draw(options).addTo(map);

//This is a workaround to allow only one shape to be drawn and exported. When a shape is finished the drawControlFull is removed from the map and this edit only tool is rendered instead.
var drawControlEditOnly = new L.Control.Draw({
    edit: {
        featureGroup: featureGroup
    },
    draw: false
});

//When a shape is created add it to the map and remove the full drawing tool from the map and replace it with an edit only version so that only one shape can be drawn and exported
map.on(L.Draw.Event.CREATED, function(e) {
    featureGroup.addLayer(e.layer);
    drawControlFull.removeFrom(map);
    drawControlEditOnly.addTo(map);

    // Show shape submit buttons when created
    $("#delete").show();
    $("#export").show();
});

//If the delete button is clicked remove the shape from the map and put the full drawing tool back on the map
$('#delete').on('click', function(e) {
    featureGroup.clearLayers();
    drawControlEditOnly.removeFrom(map);

    // Remove drawing controls and buttons
    // drawControlFull.removeFrom(map);

    console.log("test");

    $("#delete").hide();
    $("#export").hide();
});

//When the export button is clicked the drawn shape is converted to geoJSON and put in the newProject object
//This also triggers the modal where more project details are entered before being saved
$('#export').on('click', function() {

    // Extract GeoJson from featureGroup
    var data = featureGroup.toGeoJSON();
    var coordinates = JSON.stringify(data.features[0].geometry.coordinates);
    newProject.type = data.features[0].geometry.type;
    newProject.coordinates = coordinates;
});


//When the save button is clicked the newProject object is completed and an AJAX post sends the object to the back end to be saved in the PostgreSQL database
$('#save').on('click', function() {
    newProject.UID = $('#UID').val();
    newProject.title = $('#Proj_Title').val();
    newProject.description = $('#Proj_Desc').val();
    $('.modal-body').empty();
    $('.modal-body').append('<img src="/images/loading.gif" class="text-center">')
    console.log(newProject);
    $.ajax({
        method: "POST",
        url: "/projects/new",
        dataType: "json",
        data: newProject,
        success: function(data) {
          // console.log(data);

          // Reload page so that modal loading sign disappears
          window.location.reload();
        }
    });


});

// When user clicks "Add Project"...
$("#addProject").on("click", function() {

    // Show edit tools
    drawControlFull.addTo(map);
    return false;
});

$(document).ready(function() {

    // Automatically hide drawing tools upon page load
    drawControlFull.removeFrom(map);

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
});
