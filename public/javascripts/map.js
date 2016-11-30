//Creating the map with mapbox (view coordinates are downtown Los Angeles)
var map = L.mapbox.map('map').setView([
    34.0522, -118.2437
], 14);

//If we want to include multiple map layers

// L.control.layers({
//     'Satellite Map': L.mapbox.tileLayer('bobbysud.map-l4i2m7nd', {detectRetina: true}).addTo(map),
//     'Terrain Map': L.mapbox.tileLayer('bobbysud.i2pfp2lb', {detectRetina: true})
// }).addTo(map);

// TODO: Does mapbox API token expire? We probably need the city to make their own account and create a map. This is currently using Spencer's account.

//Adding the underlying map layer to the map
// L.tileLayer('https://api.mapbox.com/styles/v1/spencerc77/ciw309ms000ba2ko45wvaj6ay/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3BlbmNlcmM3NyIsImEiOiJjaXczMDZ6NWwwMTgzMm9tbXR4dGRtOXlwIn0.TPfrEq5h7Iuain1LsBsC8Q', {detectRetina: true}).addTo(map);

L.tileLayer('https://api.mapbox.com/styles/v1/spencerc77/ciw30fzgs00ap2jpg6sj6ubnn/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3BlbmNlcmM3NyIsImEiOiJjaXczMDZ6NWwwMTgzMm9tbXR4dGRtOXlwIn0.TPfrEq5h7Iuain1LsBsC8Q', {detectRetina: true}).addTo(map);

//Adding a feature group to the map
var featureGroup = L.featureGroup().addTo(map);

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
                    // layer.bindPopup('<h1>UID: ' + feature.properties.UID + '</h1>' + '<h1>Title: ' + feature.properties.title + '</h1>' + '<h1>Description: ' + feature.properties.description + '</h1>');
                    layer.on('click', function (e) {
                      // TODO: Show project details in the sidebar
                      console.log(feature.properties);
                    });
                }
            }).addTo(map);
        }
    }
});
