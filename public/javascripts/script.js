var sendObj = {};
var featureCollection = {
    "type": "FeatureCollection",
    features: []
};

var map = L.mapbox.map('map').setView([
    34.0522, -118.2437
], 14);
// var myLayer = L.geoJson().addTo(map);
// Add layers to the map
L.control.layers({
    'Satellite Map': L.mapbox.tileLayer('bobbysud.map-l4i2m7nd', {detectRetina: true}).addTo(map),
    'Terrain Map': L.mapbox.tileLayer('bobbysud.i2pfp2lb', {detectRetina: true})
}).addTo(map);

var featureGroup = L.featureGroup().addTo(map);

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
                message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
            },
            shapeOptions: {
                color: '#bada55'
            }
        },
        circle: false, // Turns off this drawing tool
        rectangle: {
            shapeOptions: {
                clickable: false
            }
        },
        // marker: {
        //     icon: new MyCustomMarker()
        // }
    },
    edit: {
        featureGroup: featureGroup, //REQUIRED!!
        remove: false
    }
};

var drawControlFull = new L.Control.Draw(options).addTo(map);

var drawControlEditOnly = new L.Control.Draw({
    edit: {
        featureGroup: featureGroup
    },
    draw: false
});

$.ajax({
    type: 'GET',
    url: '/geo',
    datatype: 'JSON',
    success: function(data) {
        if (data) {
            var features = [];
            for (var i = 0; i < data.length; i++) {
                var newGeo = {
                    type: "Feature",
                    properties: data[i].properties,
                    geometry: data[i].geometry
                }
                featureCollection.features.push(newGeo);
            }
            // myLayer.addData(featureCollection);
            L.geoJson(featureCollection, {
                style: function(feature) {
                    return {"color": "#78c679", "weight": 5, "opacity": 0.9}
                },
                // Put onEachFeature within the options object, not as 3rd argument.
                onEachFeature: function(feature, layer) {
                    layer.bindPopup('<h1>UID: ' + feature.properties.UID + '</h1>' + '<h1>Title: ' + feature.properties.title + '</h1>' + '<h1>Description: ' + feature.properties.description + '</h1>');
                }
            }).addTo(map);
        }
    }
});

map.on(L.Draw.Event.CREATED, function(e) {
    // Each time a feaute is created, it's added to the over arching feature group
    featureGroup.addLayer(e.layer);
    drawControlFull.removeFrom(map);
    drawControlEditOnly.addTo(map);
});

$('#delete').on('click', function(e) {
    eatureGroup.clearLayers();
    drawControlEditOnly.removeFrom(map);
    drawControlFull.addTo(map);
});

$('#export').on('click', function() {
    // Extract GeoJson from featureGroup
    var data = featureGroup.toGeoJSON();
    var coordinates = JSON.stringify(data.features[0].geometry.coordinates);
    sendObj.type = data.features[0].geometry.type;
    sendObj.coordinates = coordinates;
});

$('#saveImage').on('click', function() {
    sendObj.UID = $('#UID').val();
    sendObj.title = $('#Proj_Title').val();
    sendObj.description = $('#Proj_Desc').val();
    $('.modal-body').empty();
    $('.modal-body').append('<img src="/images/loading.gif" class="text-center">')
    console.log(sendObj);
    $.ajax({
        method: "POST",
        url: "/new/geo",
        dataType: "json",
        data: sendObj,
        success: function(data) {
          console.log(data);
          window.location.reload();
        }
    });
});

$(document).ready(function() {
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
