//Global Variables
var allProjects;
var funded;
var unfunded;
var bikeOnly;

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
                    return feature.properties.Fund_St === "Funded";
                },
                onEachFeature: function(feature, layer) {
                  onEachFeature(feature, layer);
                },
            });
            unfunded = L.geoJson(allProjects, {
                filter: function(feature, layer) {
                    return feature.properties.Fund_St === "Unfunded";
                },
                onEachFeature: function(feature, layer) {
                  onEachFeature(feature, layer);
                },
            });

            // bikeOnly = L.geoJson(allProjects, {
            //     filter: function(feature, layer) {
            //         return feature.properties.Proj_Ty === "Bike Only";
            //     },
            //     onEachFeature: function(feature, layer) {
            //         layer.on('click', function(e) {
            //             // TODO: Show project details in the sidebar
            //             console.log(feature.properties);
            //         });
            //     }
            // });

            funded.addTo(map);
            // bikeOnly.addTo(map);
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

  // if($('#bike-only-checkbox').is(':checked')){
  //   bikeOnly.addTo(map);
  // } else {
  //   map.removeLayer(bikeOnly);
  // }

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

function onEachFeature(feature, layer) {
  layer.on('click', function(e) {
    console.log(feature.properties);
    //Common attributes
    $('#UID').text(feature.properties.UID);
    $('#Proj_Title').text(feature.properties.Proj_Title);
    $('#Proj_Desc').text(feature.properties.Proj_Desc);
    $('#Lead_Ag').text(feature.properties.Lead_Ag);
    $('#Fund_St').text(feature.properties.Fund_St);
    $('#Proj_Man').text(feature.properties.Proj_Man);
    $('#Contact_info_name').text(feature.properties.Contact_info.Contact_info_name);
    $('#Contact_info_phone').text(feature.properties.Contact_info.Contact_info_phone);
    $('#Contact_info_email').text(feature.properties.Contact_info.Contact_info_email);
    $('#More_info').text(feature.properties.More_info);
    $('#CD').text(feature.properties.CD);

    //Separate section for funded attributes
    if (feature.properties.Fund_St === 'Funded') {
      // $('#unfunded-attributes').hide();
      $('#Dept_Proj_ID').text(feature.properties.Dept_Proj_ID);
      $('#Total_bgt').text('$' + feature.properties.Total_bgt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      $('#Grant').text('$' + feature.properties.Grant.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      $('#Other_funds').text('$' + feature.properties.Other_funds.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      $('#Prop_c').text('$' + feature.properties.Prop_c.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      $('#Measure_r').text('$' + feature.properties.Measure_r.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      $('#General_fund').text('$' + feature.properties.General_fund.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      $('#Current_Status').text(feature.properties.Current_Status);
      $('#Issues').text(feature.properties.Issues);
      $('#Deobligation').text(feature.properties.Issues);
      $('#Explanation').text(feature.properties.Explanation);
      $('#Other_ID').text(feature.properties.Other_ID);
      $('#Constr_by').text(feature.properties.Constr_by);
      $('#Info_source').text(feature.properties.Info_source);

      $('#funded-attributes').show();
    } else {
      $('#funded-attributes').hide();
      //Separate section for unfunded attributes
      $('#Grant_Cat').text(feature.properties.Grant_Cat);
      $('#Proj_Ty').text(feature.properties.Proj_Ty);
      $('#Est_Cost').text('$' + feature.properties.Est_Cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      $('#Fund_Rq').text('$' + feature.properties.Fund_Rq.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      $('#Lc_match').text('$' + feature.properties.Lc_match.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      $('#Match_Pt').text(feature.properties.Match_Pt + '%');
      $('#Comments').text(feature.properties.Comments);
      // $('#unfunded-attributes').show();
    }
  });
}
