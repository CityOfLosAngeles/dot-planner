//Global variable which will become the geoJSON layer
var geoJSON;

//Global variable which will represent the layer at the top of the map(layer that has been clicked on) so that it can be hidden
var layerID;

//Creating the map with mapbox (view coordinates are downtown Los Angeles)
var map = L.mapbox.map('map');

// TODO: Does mapbox API token expire? We probably need the city to make their own account and create a map. This is currently using Spencer's account.

L.tileLayer('https://api.mapbox.com/styles/v1/spencerc77/ciw30fzgs00ap2jpg6sj6ubnn/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3BlbmNlcmM3NyIsImEiOiJjaXczMDZ6NWwwMTgzMm9tbXR4dGRtOXlwIn0.TPfrEq5h7Iuain1LsBsC8Q', {
    detectRetina: true
}).addTo(map);

//Adding a feature group to the map
var featureGroup = L.featureGroup().addTo(map);

//Defining the bounds for all Google autocomplete inputs
//This means autocomplete search will start here and expand outwards
var defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(34.0522, -118.2437)
);

//Options for the google autocomplete inputs
var googleOptions = {
    location: defaultBounds,
    types: ['address']
};

//Create the autocomplete input
var input = document.getElementById("google-search");
var autocomplete = new google.maps.places.Autocomplete(input, googleOptions);

//Add an event listener that changes the map view when an autocomplete address is selected
google.maps.event.addListener(autocomplete, 'place_changed', function() {
    var place = autocomplete.getPlace();
    var lat = place.geometry.location.lat();
    var lng = place.geometry.location.lng();
    map.setView([lat, lng], 15);
    $('#google-search').val('');
});

//AJAX request to the PostgreSQL database to get all projects and render them on the map
function renderAllProjects(zoom) {
    $.ajax({
        type: 'GET',
        url: '/projects/all',
        datatype: 'JSON',
        success: function(data) {
            if (data) {
                var features = data.features;
                for (var i = 0; i < features.length; i++) {
                    var projectFeatures = features[i].properties;
                    var projectType = features[i].properties.Proj_Ty;
                    projectFeatures["marker-size"] = "medium";
                    if (projectType === "Ped and Bike" || projectType === "Bike/ped") {
                        projectFeatures["marker-color"] = "#5DA36C";
                        projectFeatures["marker-symbol"] = "bicycle";
                    } else if (projectType === "Ped Only") {
                        projectFeatures["marker-color"] = "#1E702F";
                        projectFeatures["marker-symbol"] = "pitch";
                    } else if (projectType === "Bike Only") {
                        projectFeatures["marker-color"] = "#AED68F";
                    } else if (projectType === "First and Last Mile" || projectType === "First mile and last mile") {
                        projectFeatures["marker-color"] = "#751917";
                    } else if (projectType === "Safety") {
                        projectFeatures["marker-color"] = "#E46247";
                        projectFeatures["marker-symbol"] = "police";
                    } else if (projectType === "SRTS") {
                        projectFeatures["marker-color"] = "#B51412";
                        projectFeatures["marker-symbol"] = "college";
                    } else if (projectType === "People St") {
                        projectFeatures["marker-color"] = "#0064A8";
                        projectFeatures["marker-symbol"] = "school";
                    } else {
                        projectFeatures["marker-color"] = "#F4984F";
                    }
                }
                if (geoJSON) {
                    geoJSON.clearLayers();
                }
                geoJSON = L.geoJson(data, {
                    style: {
                        color: "blue"
                    },
                    onEachFeature: function(feature, layer) {
                        onEachFeature(feature, layer);
                    },
                    pointToLayer: L.mapbox.marker.style
                }).addTo(map);
                if (zoom) {
                    checkZoom();
                }
            }
        }
    });
}

renderAllProjects(true);

//Function to check if a project should be zoomed in on
function checkZoom() {
    var url = window.location.href;
    if (url.includes('?id=')) {
        url = url.split('?id=');
        var id = url[url.length - 1];
        $.ajax({
            method: "GET",
            url: "/projects/id/" + id,
            dataType: "json",
            success: function(data) {
                if (data) {
                    geoJSON.eachLayer(function(l) {
                        if (l.feature.properties.id === data[0].id) {
                            l.fireEvent('click');
                        }
                    });
                }
            }
        });
    } else {
        map.setView([
            34.0522, -118.2437
        ], 10);
    }
}

// Global variable to know if we're loking for funded or unfunded
var isFunded;

// Checkbox to filter for project types
$('.filter input[type="checkbox"]').change(function() {
    filterProjectTypes();
});

// Give me funded projects
$('#fundedTab').on('click', function() {
    isFunded = "funded";
    $('#project-details').empty();
    filterProjectTypes();
});

//Give me unfunded projects
$('#unfundedTab').on('click', function() {
    isFunded = "unfunded";
    $('#project-details').empty();
    filterProjectTypes();
});

function filterProjectTypes() {

    // var fundingType = $('#fundedTab').getAttribute('value');
    var fundingType = $('#fundedTab').text().toLowerCase();
    console.log(fundingType);

    var projectTypes = $('.project-type input[type="checkbox"]:checked').map(function(_, el) {
        return $(el).val();
    }).get();

    if (projectTypes.length >= 1) {

        for (var i = 0; i < projectTypes.length; i++) {
            projectTypes[i] = projectTypes[i].split(' ').join('%20');
        }
        // funded%20unfunded%20idea%20project
        var fundingQuery = isFunded;
        var typeQuery = projectTypes.join('&');
        console.log(fundingQuery);
        console.log(typeQuery);

        $.ajax({
            type: 'GET',
            url: '/projects/funding/' + fundingQuery + '/type/' + typeQuery,
            datatype: 'JSON',
            success: function(data) {
                $('#project-details').empty();
                $('#main-info').empty();
                var count = 0;
                if (data) {
                    var features = data.features
                    for (var i = 0; i < features.length; i++) {
                        var projectFeatures = features[i].properties;
                        var projectType = features[i].properties.Proj_Ty;
                        if (projectType === "Ped and Bike" || projectType === "Bike/ped") {
                            projectFeatures["marker-color"] = "#5DA36C";
                            projectFeatures["marker-symbol"] = "bicycle";
                        } else if (projectType === "Ped Only") {
                            projectFeatures["marker-color"] = "#1E702F";
                            projectFeatures["marker-symbol"] = "pitch";
                        } else if (projectType === "Bike Only") {
                            projectFeatures["marker-color"] = "#AED68F";
                        } else if (projectType === "First and Last Mile" || projectType === "First mile and last mile") {
                            projectFeatures["marker-color"] = "#751917";
                        } else if (projectType === "Safety") {
                            projectFeatures["marker-color"] = "#E46247";
                            projectFeatures["marker-symbol"] = "police";
                        } else if (projectType === "SRTS") {
                            projectFeatures["marker-color"] = "#B51412";
                            projectFeatures["marker-symbol"] = "college";
                        } else if (projectType === "People St") {
                            projectFeatures["marker-color"] = "#0064A8";
                            projectFeatures["marker-symbol"] = "school";
                        } else {
                            projectFeatures["marker-color"] = "#F4984F";
                        }
                        projectFeatures["marker-size"] = "medium";
                        $('#project-details').append("<div class='projects_list' <p>" + features[i].properties.Proj_Title + "<br /> " + features[i].properties.ProjectProjectedCompletionDate + '              Miles   |' + features[i].properties.id + "</p></div>");
                        count++;
                    }
                    $('#main-info').append("<p><strong>Projects Listed: " + count + "</strong></p>");
                    console.log(JSON.stringify(features[0].properties.Proj_Title));
                    geoJSON.clearLayers();
                    geoJSON = L.geoJson(data, {
                        style: {
                            color: 'blue'
                        },
                        onEachFeature: function(feature, layer) {
                            onEachFeature(feature, layer);
                        },
                        pointToLayer: L.mapbox.marker.style
                    }).addTo(map);
                }
            }
        });
    } else {
        geoJSON.clearLayers();
    }
}

$('#hide-button').on('click', function() {
    geoJSON.eachLayer(function(l) {
        if (l._leaflet_id === layerID) {
            map.removeLayer(l);
        }
    });
});

$('#unhide-button').on('click', function() {
    renderAllProjects(false);
});

//Function that sets the map bounds to a project
//This essentially "zooms in" on a project
function zoomToFeature(e) {
    if (e.target.feature.geometry.type === 'Point') {
        var coordinates = e.target.feature.geometry.coordinates.slice().reverse();
        map.setView(coordinates, 16)
    } else {
        map.fitBounds(e.target.getBounds());
    }
}

function onEachFeature(feature, layer) {
    layer.on('click', function(e) {
        //Empty the cross streets since we are using .append()
        $('#Cross_Streets').empty();
        layerID = layer._leaflet_id;
        zoomToFeature(e)
        geoJSON.eachLayer(function(l) {
            geoJSON.resetStyle(l);
            if (l.feature.geometry.type === 'MultiPoint') {
                l.eachLayer(function(MultiPointLayer) {
                    MultiPointLayer.setIcon(L.mapbox.marker.icon(feature.properties));
                });
            }
            if (l.feature.geometry.type === 'Point') {
                l.setIcon(L.mapbox.marker.icon(feature.properties));
            }
        });
        if (e.target.feature.geometry.type === 'MultiPoint') {
            layer.eachLayer(function(l) {
                l.setIcon(
                    L.mapbox.marker.icon({
                        'marker-color': '#002E6D',
                        'marker-size': 'medium'
                    })
                );
            });
        }
        if (e.target.feature.geometry.type === 'Point') {
            layer.setIcon(
                L.mapbox.marker.icon({
                    'marker-color': '#002E6D',
                    'marker-size': 'medium'
                })
            );
        }
        if (e.target.feature.geometry.type != 'Point') {
            layer.bringToFront();
            layer.setStyle({
                color: '#002E6D'
            });
        }
        var fundStatus = feature.properties.Fund_St;
        $('#sidebar-fundedAndUnfunded').hide();
        $('#sidebar-funded-attributes').hide();
        $('#sidebar-unfunded-attributes').hide();
        $('#sidebar-more-info').hide();
        $('#show-info').remove();
        $('#hide-info').remove();
        $('#edit-button').show();

        $(document).on('click', '#show-info', function() {
            $('#show-info').remove();
            $('#hide-info').remove();
            var button = $('<button id="hide-info" type="button" name="button" class="btn">Less Info</button>');
            $('#project-details').append(button);
            $('#sidebar-more-info').show();
            if (fundStatus === 'Funded') {
                $('#sidebar-funded-attributes').show();
                $('#sidebar-unfunded-attributes').hide();
            } else if (fundStatus === 'Unfunded') {
                $('#sidebar-unfunded-attributes').show();
                $('#sidebar-funded-attributes').hide();
            }
        });

        $(document).on('click', '#hide-info', function() {
            $('#show-info').remove();
            $('#hide-info').remove();
            var button = $('<button id="show-info" type="button" name="button" class="btn">More Info</button>');
            $('#project-details').append(button);
            $('#sidebar-more-info').hide();
            if (fundStatus === 'Funded') {
                $('#sidebar-funded-attributes').hide();
            } else if (fundStatus === 'Unfunded') {
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
            if (feature.properties.Cross_Streets && feature.properties.Cross_Streets.Intersections) {
                var streets = feature.properties.Cross_Streets.Intersections;
                streetsString = '';
                for (var i = 0; i < streets.length; i++) {
                    streetsString += '<p>' + streets[i] + '</p><br>';
                }
                $('#Cross_Streets').append(streetsString);
            }
            $('#sidebar-fundedAndUnfunded').show();
            var button = $('<button id="show-info" class="btn" type="button" name="button">More Info</button>');
            $('#project-details').append(button);
        }

        //Separate section for funded attributes
        if (fundStatus === 'Funded') {
            $('#Dept_Proj_ID').text(feature.properties.Dept_Proj_ID);
            $('#Other_ID').text(feature.properties.Other_ID);
            if (feature.properties.Total_bgt) {
                $('#Total_bgt').text('$' + feature.properties.Total_bgt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            }
            if (feature.properties.Grant) {
                $('#Grant').text('$' + feature.properties.Grant.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            }
            if (feature.properties.Other_funds) {
                $('#Other_funds').text('$' + feature.properties.Other_funds.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            }
            if (feature.properties.Prop_c) {
                $('#Prop_c').text('$' + feature.properties.Prop_c.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            }
            if (feature.properties.Measure_r) {
                $('#Measure_r').text('$' + feature.properties.Measure_r.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            }
            if (feature.properties.Gas_Tax) {
                $('#Gas_Tax').text('$' + feature.properties.Gas_Tax.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            }
            if (feature.properties.General_fund) {
                $('#General_fund').text('$' + feature.properties.General_fund.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            }
            $('#Authorization').text(feature.properties.Authorization);
            $('#Issues').text(feature.properties.Issues);
            $('#Deobligation').text(feature.properties.Deobligation);
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
            if (feature.properties.Est_Cost) {
                $('#Est_Cost').text('$' + feature.properties.Est_Cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            }
            if (feature.properties.Fund_Rq) {
                $('#Fund_Rq').text('$' + feature.properties.Fund_Rq.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            }
            if (feature.properties.Lc_match) {
                $('#Lc_match').text('$' + feature.properties.Lc_match.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            }
            $('#Match_Pt').text(feature.properties.Match_Pt + '%');
        }
        $('#edit-button').attr('data-href', "/projects/edit/" + feature.properties.id);
    });
}

//When the edit button is clicked redirect to the edit page which is defined in data-href
$(document).on('click', '#edit-button', function() {
    window.location = $('#edit-button').attr('data-href');
});

$('#export-csv').on('click', function() {
    exportCSV();
});

$('#export-shapefiles').on('click', function() {
    separateShapes();
});

function exportCSV() {
    var searchIDs = [];
    var bounds = map.getBounds();
    geoJSON.eachLayer(function(layer) {
        if (layer.feature.geometry.type === 'Point') {
            if (bounds.contains(layer.getLatLng())) {
                searchIDs.push(layer.feature.properties.id);
            }
        } else if (layer.feature.geometry.type === 'MultiPoint') {
            if (bounds.contains(layer.getBounds())) {
                searchIDs.push(layer.feature.properties.id);
            }
        } else {
            if (bounds.contains(layer.getLatLngs())) {
                searchIDs.push(layer.feature.properties.id);
            }
        }
    });

    var queryString = searchIDs.join('&')
    $.ajax({
        method: "GET",
        url: "/projects/ids/" + queryString,
        dataType: "json",
        success: function(data) {
            var geoJSON = JSON.stringify(data);
            $.post('https://ogre.adc4gis.com/convertJson', {
                    json: geoJSON,
                    format: "csv"
                },
                function(csv) {
                    a = document.createElement('a');
                    a.download = "projects.csv";
                    a.href = 'data:text/csv;charset=utf-8,' + escape(csv);
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                });
        }
    });
}

function separateShapes() {
    var bounds = map.getBounds();
    var points = {
        name: 'points',
        features: []
    };
    var lines = {
        name: 'lines',
        features: []
    };
    var multilines = {
        name: 'multilinestrings',
        features: []
    };
    var polygons = {
        name: 'polygons',
        features: []
    };
    var multipoints = {
        name: 'multipoints',
        features: []
    }
    geoJSON.eachLayer(function(layer) {
        switch (layer.feature.geometry.type) {
            case 'Point':
                if (bounds.contains(layer.getLatLng())) {
                    points.features.push(layer.feature.properties.id);
                }
                break;
            case 'MultiPoint':
                if (bounds.contains(layer.getBounds())) {
                    multipoints.features.push(layer.feature.properties.id);
                }
                break;
            case 'LineString':
                if (bounds.contains(layer.getLatLngs())) {
                    lines.features.push(layer.feature.properties.id);
                }
                break;
            case 'MultiLineString':
                if (bounds.contains(layer.getLatLngs())) {
                    multilines.features.push(layer.feature.properties.id);
                }
                break;
            case 'Polygon':
                if (bounds.contains(layer.getLatLngs())) {
                    polygons.features.push(layer.feature.properties.id);
                }
                break;
        }
    });
    var shapeFilesArr = [points, lines, polygons, multilines, multipoints];
    for (var i = shapeFilesArr.length - 1; i >= 0; i--) {
        if (shapeFilesArr[i].features.length < 1) {
            shapeFilesArr.splice(i, 1);
        }
    }
    for (var i = 0; i < shapeFilesArr.length; i++) {
        downloadShapeFiles(shapeFilesArr[i], i + 1, shapeFilesArr.length)
    }
}

function downloadShapeFiles(geoTypeObj) {
    var queryString = geoTypeObj.features.join('&');
    $.ajax({
        method: "GET",
        url: "/projects/ids/" + queryString,
        dataType: "json",
        success: function(data) {
            var geoJSON = JSON.stringify(data);
            // XHR Request Working
            var formData = new FormData();
            formData.append('json', geoJSON);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "https://ogre.adc4gis.com/convertJson");
            xhr.responseType = "arraybuffer"; // ask for a binary result
            xhr.onreadystatechange = function(evt) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        JSZip.loadAsync(xhr.response).then(function(zip) {
                            zip.generateAsync({
                                    type: "blob"
                                })
                                .then(function(blob) {
                                    saveAs(blob, geoTypeObj.name + '.zip');
                                });
                        });
                    } else {
                        console.log("http call error");
                    }
                }
            };
            xhr.send(formData);
        }
    });
}