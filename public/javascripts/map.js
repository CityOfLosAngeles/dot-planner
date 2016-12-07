//Global Variables
var allProjects;
var funded;
var unfunded;

//Creating the map with mapbox (view coordinates are downtown Los Angeles)
var map = L.mapbox.map('map').setView([
    34.0522, -118.2437
], 14);

// TODO: Does mapbox API token expire? We probably need the city to make their own account and create a map. This is currently using Spencer's account.

L.tileLayer('https://api.mapbox.com/styles/v1/spencerc77/ciw30fzgs00ap2jpg6sj6ubnn/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3BlbmNlcmM3NyIsImEiOiJjaXczMDZ6NWwwMTgzMm9tbXR4dGRtOXlwIn0.TPfrEq5h7Iuain1LsBsC8Q', {detectRetina: true}).addTo(map);

//Adding a feature group to the map
var featureGroup = L.featureGroup().addTo(map);

var input = document.getElementById("google-search");

var searchBox = new google.maps.places.SearchBox(input);
searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();
    if (places.length == 0) {
        return;
    }
    var group = L.featureGroup();
    places.forEach(function(place) {
        // console.log("for each");
        var lat = place.geometry.location.lat();
        var long = place.geometry.location.lng();
        var pairs = [lat, long]
        map.setView([
            lat, long
        ], 15);
        L.marker(pairs).addTo(map);
        //Empty the search box afterwards (looks kind of weird right now so commented out.)
        $('#google-search').val('');
    });
});

//AJAX request to the PostgreSQL database to get all projects and render them on the map
$.ajax({
    type: 'GET',
    url: '/projects',
    datatype: 'JSON',
    success: function(data) {
        console.log(data);
        if (data) {
            allProjects = data;
            funded = L.geoJson(allProjects, {
                filter: function(feature, layer) {
                    return feature.properties.Fund_St == "Funded";
                },
                onEachFeature: function(feature, layer) {
                    layer.on('click', function(e) {
                        // TODO: Show project details in the sidebar
                        console.log(feature.properties);
                    });
                }
            });
            unfunded = L.geoJson(allProjects, {
                filter: function(feature, layer) {
                    return feature.properties.Fund_St == "Unfunded";
                },
                onEachFeature: function(feature, layer) {
                    layer.on('click', function(e) {
                        // TODO: Show project details in the sidebar
                        console.log(feature.properties);
                    });
                }
            });
            funded.addTo(map);
            unfunded.addTo(map);
        }
    }
});

//Commented out for now

function filterProjects() {

  if($('#funded-checkbox').is(':checked')){
    funded.addTo(map);
  } else {
    map.removeLayer(funded);
  }

  if($('#unfunded-checkbox').is(':checked')){
    unfunded.addTo(map);
  } else {
    map.removeLayer(unfunded);
  }

  //Get the types that are check and store them in an array

  // options.types = $('.type input[type=checkbox]:checked').map(function(_, el) {
  //   return $(el).val();
  // }).get();
}
//
$('#map-filter input').change(function() {
  filterProjects();
});
//
// $(document).ready(function() {
//   checkFiltersAndFilter();
// });
