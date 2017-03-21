//Global variable which will become the geoJSON layer
var geoJSON;

//Global variable which will represent the layer at the top of the map(layer that has been clicked on) so that it can be hidden
var layerID;

//Creating the map with mapbox (view coordinates are downtown Los Angeles)
// var map = L.mapbox.map('map');

var colors = {
    red: "#FF355E",
    // safety / police

    watermelon: "#FD5B78",
    // srts / triangle

    orange: "#FF9933",
    // else / marker

    sun: "#FFCC33",
    // bike / bicycle

    rose: "#EE34D2",
    // ped & bike / entrance

    lime: "#CCFF00",
    // first & last / hospital

    green: "#66FF66",
    // people / city

    mint: "#AAF0D1",
    // ped / toilets

    blue: "#50BFE6"
    // transit / rail
};

function getMarkerStyle(type) {

    var newMarker = {
        "marker-color": "",
        "marker-symbol": ""
    };

    var projectType;

    if (type) {
        projectType = type.trim();
    } else {
        projectType = type;
    }

    if (projectType === "Ped and Bike" || projectType === "Bike/ped") {
        newMarker["marker-color"] = colors.rose;
        newMarker["marker-symbol"] = "pitch"
    }

    else if (projectType === "Bike Only") {
        newMarker["marker-color"] = colors.sun;
        newMarker["marker-symbol"] = "bicycle";
    }
    else if (projectType === "Ped Only") {
        newMarker["marker-color"] = colors.mint;
        newMarker["marker-symbol"] = "toilets";
    }
    else if (projectType === "First and Last Mile" || projectType === "First mile and last mile") {
        newMarker["marker-color"] = colors.lime;
        newMarker["marker-symbol"] = "hospital"
    }
    else if (projectType === "Safety") {
        newMarker["marker-color"] = colors.red;
        newMarker["marker-symbol"] = "police";
    }
    else if (projectType === "SRTS") {
        newMarker["marker-color"] = colors.watermelon;
        newMarker["marker-symbol"] = "triangle-stroked";
    }
    else if (projectType === "People St") {
        newMarker["marker-color"] = colors.green;
        newMarker["marker-symbol"] = "city";
    }
    else if (projectType === "Transit") {
        newMarker["marker-color"] = colors.blue;
        newMarker["marker-symbol"] = "bus";
    }
    else {
        newMarker["marker-color"] = colors.orange;
        newMarker["marker-symbol"] = "marker"
    }

    return newMarker;
};

// TODO: Does mapbox API token expire? We probably need the city to make their own account and create a map. This is currently using Spencer's account.

// Creating the map with mapbox (view coordinates are downtown Los Angeles)
var map = L.mapbox.map('map', {
    layers: [imageryLayer]
});

// TODO: Does mapbox API token expire? We probably need the city to make their own account and create a map. This is currently using Spencer's account.
var imageryLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    id: 'SATELLITE',
    //attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    detectRetina: true
});

var overlayMaps = {
    'Satellite': imageryLayer
};

L.control.layers({}, overlayMaps).addTo(map);

L.tileLayer("https://api.mapbox.com/styles/v1/spencerc77/ciw30fzgs00ap2jpg6sj6ubnn/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3BlbmNlcmM3NyIsImEiOiJjaXczMDZ6NWwwMTgzMm9tbXR4dGRtOXlwIn0.TPfrEq5h7Iuain1LsBsC8Q", {
    detectRetina: true
}, {}).addTo(map);

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

    $("#edit-button").attr("disabled", "true");
    $.ajax({
        type: 'GET',
        url: '/projects/all',
        datatype: 'JSON',
        success: function(data) {
            if (data) {
                var features = data.features;
                for (var i = 0; i < features.length; i++) {

                    var projectFeatures = features[i].properties;

                    var projectType = projectFeatures.Proj_Ty;

                    var markerStyle = getMarkerStyle(projectType);


                    projectFeatures["marker-color"] = markerStyle["marker-color"];
                    projectFeatures["marker-symbol"] = markerStyle["marker-symbol"];
                    projectFeatures["marker-size"] = "small";
                }

                if (geoJSON) {
                    geoJSON.clearLayers();
                }
                geoJSON = L.geoJson(data, {
                    style: {
                        color: "#004EB9"
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
// $('.filter input[type="checkbox"]').change(function() {
//     filterProjectTypes();
// });

// Give me funded projects
$('#fundedTab').on('click', function() {
    isFunded = "funded";
    $('#project-details').hide();
    $('#main-info').empty();
    filterProjectTypes();
});

//Give me unfunded projects
$('#unfundedTab').on('click', function() {
    isFunded = "unfunded";
    $('#project-details').hide();
    $('#main-info').empty();
    filterProjectTypes();
});

$(".filter-check").change(function() {
    if (!isFunded) {
        filterProjectTypes(true);
    }
});

/* FILTER PROJECT TYPES FUNCTION */
function filterProjectTypes(type) {

    // reset map view
    checkZoom();

    // var fundingType = $('#fundedTab').getAttribute('value');
    // var fundingType = $('#fundedTab').text().toLowerCase();
    // console.log(fundingType);

    var projectTypes = $('.project-type input[type="checkbox"]:checked').map(function(_, el) {
        return $(el).val();
    }).get();

    if (projectTypes.length >= 1) {

        for (var i = 0; i < projectTypes.length; i++) {
            projectTypes[i] = projectTypes[i].split(' ').join('%20');
        }

        var fundingQuery = isFunded;
        var typeQuery = projectTypes.join('&');

        if (type) {
            $.ajax({
                type: 'GET',
                url: '/projects/type/' + typeQuery,
                datatype: 'JSON',
                success: function (data) {
                    displayResults(data);
                }
            });
        } else {
            $.ajax({
                type: 'GET',
                url: '/projects/funding/' + fundingQuery + '/type/' + typeQuery,
                datatype: 'JSON',
                success: function (data) {
                    displayResults(data);
                }
            });
        }

    } else {
        geoJSON.clearLayers();
    }
}

function displayResults(results) {


    $('#main-info').empty();
    // show main info div
    $('#main-info').show();

    // hide project details div
    $("#project-details").hide();

    var panelGroup = $("<div>");

    panelGroup
        .addClass("panel-group")
        .attr("id", "project-accordian")
        .attr("role", "tablist")
        .attr("aria-multiselectable", "true");

    $("#main-info").append(panelGroup);

    var count = 0;

    var features = results.features;
    for (var i = 0; i < features.length; i++) {

        var projectFeatures = features[i].properties;
        var projectType = projectFeatures.Proj_Ty;

        var markerStyle = getMarkerStyle(projectType);

        projectFeatures["marker-color"] = markerStyle["marker-color"];
        projectFeatures["marker-symbol"] = markerStyle["marker-symbol"];
        projectFeatures["marker-size"] = "small";

        // build accordian panel
        var panel = $("<div>");
        panel
            .addClass("row panel projects-list-item");

        var panelHeading = $("<div>");
        panelHeading
            .addClass("col-sm-12 panel-heading project-heading")
            .attr("id", "heading_" + i)
            .attr("role", "tab");

        var panelTitle = $("<h3>");
        panelTitle
            .addClass("panel-title project-title");

        var panelLink = $("<a>");
        panelLink
            .addClass("project-heading-data")
            .attr("role", "button")
            .attr("data-toggle", "collapse")
            .attr("data-parent", "#project-accordian")
            .attr("href", "#collapse_" + i)
            .attr("aria-expanded", "true")
            .attr("aria-controls", "collapse_" + i)
            .text(projectFeatures.Proj_Title);

        panelTitle.append(panelLink);

        var panelHeaderData = $("<div>");
        panelHeaderData
            .addClass("row");

        var panelHeaderColumn1 = $("<div>");
        panelHeaderColumn1
            .addClass("col-sm-9");

        var panelMiles = $("<h6>");
        var panelCompletion = $("<h6>");
        var panelId = $("<h6>");

        panelMiles
            .addClass("project-heading-data")
            .text("MILES: ");

        var completionDate = projectFeatures.ProjectProjectedCompletionDate;

        if (completionDate) {
            completionDate = moment(completionDate).format("MMM Do YY")
        } else {
            completionDate = "TBD";
        }

        panelCompletion
            .addClass("project-heading-data")
            .text("COMPLETION DATE: " + moment(projectFeatures.ProjectProjectedCompletionDate).format("MMM Do YY"));

        panelId
            .addClass("project-heading-data")
            .text("ID: " + projectFeatures.id);

        panelHeaderColumn1
            .append(panelMiles)
            .append(panelCompletion)
            .append(panelId);

        var panelHeaderColumn2 = $("<div>");
        panelHeaderColumn2
            .addClass("col-sm-2");

        var projectColor = markerStyle["marker-color"];

        var panelIcon = $("<i>");
        panelIcon
            .addClass("fa fa-circle fa-3x panel-icon")
            .attr("aria-hidden", "true")
            .css("color", projectColor);

        var panelSvg = $("<img>");
        var projectIcon = markerStyle["marker-symbol"];
        panelSvg
            .attr("src", "/images/icons/" + projectIcon + ".svg")
            .addClass("panel-svg");

        panelIcon
            .append(panelSvg);

        panelHeaderColumn2
            .append(panelIcon);

        panelHeaderData
            .append(panelHeaderColumn1)
            .append(panelHeaderColumn2);

        panelHeading
            .append(panelTitle)
            .append(panelHeaderData);

        panel
            .append(panelHeading);

        var panelBodyCollapse = $("<div>");

        panelBodyCollapse
            .addClass("panel-collapse collapse")
            .attr("id", "collapse_" + i)
            .attr("role", "tabpanel")
            .attr("aria-labelledby", "heading_" + i);

        var panelBody = $("<div>");
        panelBody
            .addClass("project-body panel-body");

        var projTitle = $("<p>");
        projTitle
            .text("Title: " + projectFeatures.Proj_Title);

        var projDesc = $("<p>");
        projDesc
            .text("Description: " + projectFeatures.Proj_Desc);

        var legacyId = $("<p>");
        legacyId
            .text("Legacy ID: " + projectFeatures.Legacy_ID);

        var leadAg = $("<p>");
        leadAg
            .text("Lead Agency: " + projectFeatures.Lead_Ag);

        var fundSt = $("<p>");
        fundSt
            .text("Funding Status: " + projectFeatures.Fund_St);

        var projTy = $("<p>");
        projTy
            .text("Project Type: " + projectFeatures.Proj_Ty);

        var contactName = $("<p>");
        contactName
            .text("Contact Name: " + projectFeatures.Contact_info.Contact_info_name);

        var contactPhone = $("<p>");
        contactPhone
            .text("Contact Phone: " + projectFeatures.Contact_info.Contact_info_phone);

        var contactEmail = $("<p>");
        contactEmail
            .text("Contact Email: " + projectFeatures.Contact_info.Contact_info_email);

        panelBody
            .append(projTitle)
            .append(projDesc)
            .append(legacyId)
            .append(leadAg)
            .append(fundSt)
            .append(projTy)
            .append(contactName)
            .append(contactPhone)
            .append(contactEmail);

        panelBodyCollapse
            .append(panelBody);

        panel
            .append(panelBodyCollapse);

        var panelButton = $("<button>");
        panelButton
            .addClass("btn project-body-button")
            .attr("type", "button")
            .attr("data-toggle", "collapse")
            .attr("data-target", "#collapseMore_" + i)
            .attr("aria-expanded", "false")
            .attr("aria-controls", "collapseMore_" + i)
            .text("More Info");

        var viewButton = $("<a>");
        viewButton
            .addClass("btn project-body-button")
            .attr("type", "button")
            .attr("data-id", projectFeatures.id)
            .text("View Project");

        panelBodyCollapse
            .append(panelButton)
            .append(viewButton);

        var moreData = $("<div>");
        moreData
            .addClass("collapse").attr("id", "collapseMore_" + i);

        var moreDataWell = $("<div>");
        moreDataWell
            .addClass("project-more-data well");

        if (isFunded === "funded") {

            // funded project marker color


            var deptProjId = $("<p>");
            deptProjId.text("Dept Project ID: " + projectFeatures.Dept_Proj_ID);
            moreDataWell.append(deptProjId);

            var otherId = $("<p>");
            otherId.text("Other ID: " + projectFeatures.Other_ID);
            moreDataWell.append(otherId);

            if (projectFeatures.Total_bgt) {
                var totalBgt = $("<p>");
                totalBgt.text("Total Budget: $" + projectFeatures.Total_bgt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                moreDataWell.append(totalBgt);
            }

            if (projectFeatures.Grant) {
                var grant = $("<p>");
                grant.text("Grant: $" + projectFeatures.Grant.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                moreDataWell.append(grant);
            }

            if (projectFeatures.Other_funds) {
                var otherFunds = $("<p>");
                otherFunds.text("Other Funds: $" + projectFeatures.Other_funds.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                moreDataWell.append(otherFunds);
            }

            if (projectFeatures.Prop_c) {
                var propC = $("<p>");
                propC.text("Prop C: $" + projectFeatures.Prop_c.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                moreDataWell.append(propC);
            }

            if (projectFeatures.Measure_r) {
                var measureR = $("<p>");
                measureR.text("Measure R: $" + projectFeatures.Measure_r.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                moreDataWell.append(measureR);
            }

            if (projectFeatures.Gas_Tax) {
                var gasTax = $("<p>");
                gasTax.text("Gas Tax: $" + projectFeatures.Gas_Tax.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));

                moreDataWell.append(gasTax);
            }

            if (projectFeatures.General_fund) {
                var generalFund = $("<p>");
                generalFund.text("General Fund: $" + projectFeatures.General_fund.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                moreDataWell.append(generalFund);
            }

            var authorization = $("<p>");
            authorization.text("Authorization: " + projectFeatures.Authorization);
            var issues = $("<p>");
            issues.text("Issues: " + projectFeatures.Issues);
            var deobligation = $("<p>");
            deobligation.text("Deobligation: " + projectFeatures.Deobligation);
            var explanation = $("<p>");
            explanation.text("Explanation: " + projectFeatures.Explanation);
            var constrBy = $("<p>");
            constrBy.text("Constructed By: " + projectFeatures.Constr_by);
            var infoSource = $("<p>");
            infoSource.text("Info Source: " + projectFeatures.Info_source);
            var access = $("<p>");
            access.text("Access: " + projectFeatures.Access);

            moreDataWell.append(authorization).append(issues).append(deobligation).append(explanation).append(constrBy).append(infoSource).append(access);
        }

        if (isFunded === "unfunded") {

            // unfunded project marker color



            var unfundedMoreInfo = $("<p>");
            unfundedMoreInfo.text("Unfunded More Info: " + projectFeatures.More_info);
            var unfundedCD = $("<p>");
            unfundedCD.text("Unfunded CD: " + projectFeatures.CD);
            var grantCat = $("<p>");
            grantCat.text("Grant Category: " + projectFeatures.Grant_Cat);
            var grantCycle = $("<p>");
            grantCycle.text(projectFeatures.Grant_Cycle);

            moreDataWell.append(unfundedMoreInfo).append(unfundedCD).append(grantCat).append(grantCycle);

            if (projectFeatures.Est_Cost) {
                var estCost = $("<p>");
                estCost.text("Estimated Cost: $" + projectFeatures.Est_Cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                moreDataWell.append(estCost);
            }
            if (projectFeatures.Fund_Rq) {
                var fundRq = $("<p>");
                fundRq.text("Fund Request: " + projectFeatures.Fund_Rq.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                moreDataWell.append(fundRq);
            }

            if (projectFeatures.Lc_match) {
                var LcMatch = $("<p>");
                LcMatch.text("Lc Match: $ " + projectFeatures.Lc_match.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                moreDataWell.append(LcMatch);
            }
            var matchPt = $("<p>");
            matchPt.text("Match Percentage: " + projectFeatures.Match_Pt + "%");
            moreDataWell.append(matchPt);
        }

        moreData.append(moreDataWell);

        panelBodyCollapse.append(moreData);

        panelGroup.append(panel);

        count++;
    }
    $("#count-info").empty();
    $('#count-info').append("<p><strong>Projects Listed: " + count + "</strong></p>");
    geoJSON.clearLayers();
    geoJSON = L.geoJson(results, {
        style: {
            color: "#004EB9"
        },
        onEachFeature: function(feature, layer) {
            onEachFeature(feature, layer);
        },
        pointToLayer: L.mapbox.marker.style
    }).addTo(map);
}

$(document).on("click", ".project-body-button", function() {
    var id = $(this).data("id");
    console.log(id);
    $.ajax({
        method: "GET",
        url: "/projects/id/" + id,
        datatype: 'JSON',
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
});

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

/* ZOOM TO FEATURE FUNCTION */
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


/* ON EACH FEATURE FUNCTION */
function onEachFeature(feature, layer) {
    layer.on('click', function(e) {


        $("#project-details").show();
        $("#main-info").hide();

        //Empty the cross streets since we are using .append()
        $('#Cross_Streets').empty();
        layerID = layer._leaflet_id;
        zoomToFeature(e);
        geoJSON.eachLayer(function(l) {
            geoJSON.resetStyle(l);
            if (l.feature.geometry.type === 'MultiPoint') {
                l.eachLayer(function(MultiPointLayer) {

                    var projectType = l.feature.properties.Proj_Ty;

                    var markerStyle = getMarkerStyle(projectType);

                    MultiPointLayer.setIcon(L.mapbox.marker.icon({
                        "marker-color": markerStyle["marker-color"],
                        "marker-symbol": markerStyle["marker-symbol"],
                        "marker-size": "small"
                    }));
                });
            }
            if (l.feature.geometry.type === 'Point') {

                var projectType = l.feature.properties.Proj_Ty;

                var markerStyle = getMarkerStyle(projectType);
                l.setIcon(L.mapbox.marker.icon({
                    "marker-color": markerStyle["marker-color"],
                    "marker-symbol": markerStyle["marker-symbol"],
                    "marker-size": "small"
                }));
            }
        });
        if (e.target.feature.geometry.type === 'MultiPoint') {
            layer.eachLayer(function(l) {
                var projectType = e.target.feature.properties.Proj_Ty;

                var markerStyle = getMarkerStyle(projectType);
                l.setIcon(
                    L.mapbox.marker.icon({
                        "marker-color": markerStyle["marker-color"],
                        "marker-symbol": "star",
                        "marker-size": "large"
                    })
                );
            });
        }
        if (e.target.feature.geometry.type === 'Point') {
            var projectType = e.target.feature.properties.Proj_Ty;

            var markerStyle = getMarkerStyle(projectType);

            layer.setIcon(
                L.mapbox.marker.icon({
                    "marker-color": markerStyle["marker-color"],
                    "marker-symbol": "star",
                    "marker-size": "large"
                })
            );
        }
        if (e.target.feature.geometry.type != 'Point') {
            layer.bringToFront();
            var projectType = e.target.feature.properties.Proj_Ty;

            var markerStyle = getMarkerStyle(projectType);

            layer.setStyle({
                color: markerStyle["marker-color"]
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
        $("#edit-button").removeAttr("disabled");
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
    };
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