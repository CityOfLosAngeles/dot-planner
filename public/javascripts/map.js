//Creating the map with mapbox (view coordinates are downtown Los Angeles)
var map = L.mapbox.map('map').setView([
    34.0522, -118.2437
], 14);

// TODO: Does mapbox API token expire? We probably need the city to make their own account and create a map. This is currently using Spencer's account.

L.tileLayer('https://api.mapbox.com/styles/v1/spencerc77/ciw30fzgs00ap2jpg6sj6ubnn/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3BlbmNlcmM3NyIsImEiOiJjaXczMDZ6NWwwMTgzMm9tbXR4dGRtOXlwIn0.TPfrEq5h7Iuain1LsBsC8Q', {detectRetina: true}).addTo(map);

//Adding a feature group to the map
var featureGroup = L.featureGroup().addTo(map);

var defaultBounds = new google.maps.LatLngBounds(
  new google.maps.LatLng(34.0522, -118.2437)
);

var googleOptions = {
  location: defaultBounds,
  types: ['address']
};

var input = document.getElementById("google-search");
var autocomplete = new google.maps.places.Autocomplete(input, googleOptions);
google.maps.event.addListener(autocomplete, 'place_changed', function() {
  var place = autocomplete.getPlace();
  var lat = place.geometry.location.lat();
  var lng = place.geometry.location.lng();
  map.setView([lat, lng], 15);
  $('#google-search').val('');
});

//AJAX request to the PostgreSQL database to get all projects and render them on the map
$.ajax({
    type: 'GET',
    url: '/projects/all',
    datatype: 'JSON',
    success: function(data) {
        console.log(data);
        if (data) {
          console.log(data);
            geoJSON = L.geoJson(data, {
                onEachFeature: function(feature, layer) {
                  onEachFeature(feature, layer);
                },
            }).addTo(map);
        }
    }
});


$('#filter').on('click', function() {
  filterProjects();
});

//Commented out for now
function filterProjects() {
  var fundingTypes = $('.funding-types input[type="checkbox"]:checked').map(function(_, el) {
    return $(el).val();
  }).get();

  var projectTypes = $('.project-type input[type="checkbox"]:checked').map(function(_, el) {
    return $(el).val();
  }).get();

  if (fundingTypes.length >= 1 && projectTypes.length >= 1) {
    for (var i = 0; i < fundingTypes.length; i++) {
      fundingTypes[i] = fundingTypes[i].split(' ').join('%20');
    }
    for (var i = 0; i < projectTypes.length; i++) {
      projectTypes[i] = projectTypes[i].split(' ').join('%20');
    }

    var fundingQuery = fundingTypes.join('&');
    var typeQuery = projectTypes.join('&');
    $.ajax({
        type: 'GET',
        url: '/projects/funding/' + fundingQuery + '/type/' + typeQuery,
        datatype: 'JSON',
        success: function(data) {
            console.log(data);
            if (data) {
              geoJSON.clearLayers();
              geoJSON = L.geoJson(data, {
                    onEachFeature: function(feature, layer) {
                      onEachFeature(feature, layer);
                    },
                }).addTo(map);
            }
        }
    });
  } else {
    geoJSON.clearLayers();
  }
}

function onEachFeature(feature, layer) {
  layer.on('click', function(e) {
    var fundStatus = feature.properties.Fund_St;
    $('#sidebar-fundedAndUnfunded').hide();
    $('#sidebar-funded-attributes').hide();
    $('#sidebar-unfunded-attributes').hide();
    $('#sidebar-more-info').hide();
    $('#show-info').remove();
    $('#hide-info').remove();
    $('#edit-button').remove();

    $(document).on('click', '#show-info', function() {
      $('#show-info').remove();
      $('#hide-info').remove();
      var button = $('<button id="hide-info" class="btn btn-danger" type="button" name="button">Less Info</button>');
      $('#project-details').append(button);
      $('#sidebar-more-info').show();
      if (fundStatus === 'Funded') {
        $('#sidebar-funded-attributes').show();
        $('#sidebar-unfunded-attributes').hide();
      } else if(fundStatus === 'Unfunded') {
        $('#sidebar-unfunded-attributes').show();
        $('#sidebar-funded-attributes').hide();
      }
    });

    $(document).on('click', '#hide-info', function() {
      $('#show-info').remove();
      $('#hide-info').remove();
      var button = $('<button id="show-info" class="btn btn-primary" type="button" name="button">More Info</button>');
      $('#project-details').append(button);
      $('#sidebar-more-info').hide();
      if (fundStatus === 'Funded') {
        $('#sidebar-funded-attributes').hide();
      } else if(fundStatus === 'Unfunded') {
        $('#sidebar-unfunded-attributes').hide();
      }
    });

    //Common attributes
    $('#Proj_Title').text(feature.properties.Proj_Title);
    $('#Proj_Desc').text(feature.properties.Proj_Desc);
    $('#Legacy_ID').text(feature.properties.Legacy_ID);
    $('#Lead_Ag').text(feature.properties.Lead_Ag);
    $('#Fund_St').text(feature.properties.Fund_St);
    $('#Proj_Ty').text(feature.properties.Proj_Ty);
    $('#Contact_info_name').text(feature.properties.Contact_info.Contact_info_name);
    $('#Contact_info_phone').text(feature.properties.Contact_info.Contact_info_phone);
    $('#Contact_info_email').text(feature.properties.Contact_info.Contact_info_email);

    if (fundStatus != 'Idea Project') {
      $('#Proj_Man').text(feature.properties.Proj_Man);
      $('#Current_Status').text(feature.properties.Proj_Status);
      $('#More_info').text(feature.properties.More_info);
      $('#CD').text(feature.properties.CD);
      $('#Primary_Street').text(feature.properties.Primary_Street);
      $('#Cross_Streets').text(feature.properties.Cross_Streets.Intersections);
      $('#sidebar-fundedAndUnfunded').show();
      var button = $('<button id="show-info" class="btn btn-primary" type="button" name="button">More Info</button>');
      $('#project-details').append(button);
    }

    //Separate section for funded attributes
    if (fundStatus === 'Funded') {
      $('#Dept_Proj_ID').text(feature.properties.Dept_Proj_ID);
      $('#Other_ID').text(feature.properties.Other_ID);
      $('#Total_bgt').text('$' + feature.properties.Total_bgt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      $('#Grant').text('$' + feature.properties.Grant.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      $('#Other_funds').text('$' + feature.properties.Other_funds.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      $('#Prop_c').text('$' + feature.properties.Prop_c.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      $('#Measure_r').text('$' + feature.properties.Measure_r.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      $('#Gas_Tax').text('$' + feature.properties.Gas_Tax.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      $('#General_fund').text('$' + feature.properties.General_fund.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      $('#Authorization').text(feature.properties.Authorization);
      $('#Issues').text(feature.properties.Issues);
      $('#Deobligation').text(feature.properties.Issues);
      $('#Explanation').text(feature.properties.Explanation);
      $('#Constr_by').text(feature.properties.Constr_by);
      $('#Info_source').text(feature.properties.Info_source);
      $('#Access').text(feature.properties.Access);

    } else if (fundStatus === 'Unfunded') {
      //Unfunded
      $('#Unfunded-More_info').text(feature.properties.More_info);
      $('#Unfunded-CD').text(feature.properties.CD);
      $('#Grant_Cat').text(feature.properties.Grant_Cat);
      $('#Grant_Cycle').text(feature.properties.Grant_Cycle);
      $('#Est_Cost').text('$' + feature.properties.Est_Cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      $('#Fund_Rq').text('$' + feature.properties.Fund_Rq.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      $('#Lc_match').text('$' + feature.properties.Lc_match.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      $('#Match_Pt').text(feature.properties.Match_Pt + '%');
    }
    var editButton = $('<button class="btn btn-danger" id="edit-button" data-href="/projects/edit/' + feature.properties.id + '">Edit Project</button>');
    $('#project-details').prepend(editButton);

  });
}

$(document).on('click', '#edit-button', function() {
  window.location = $('#edit-button').attr('data-href');
});
