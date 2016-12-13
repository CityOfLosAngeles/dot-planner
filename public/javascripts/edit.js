//Creating the map with mapbox (view coordinates are downtown Los Angeles)
var map = L.mapbox.map('map').setView([
    34.0522, -118.2437
], 14);

// TODO: Does mapbox API token expire? We probably need the city to make their own account and create a map. This is currently using Spencer's account.

L.tileLayer('https://api.mapbox.com/styles/v1/spencerc77/ciw30fzgs00ap2jpg6sj6ubnn/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3BlbmNlcmM3NyIsImEiOiJjaXczMDZ6NWwwMTgzMm9tbXR4dGRtOXlwIn0.TPfrEq5h7Iuain1LsBsC8Q', {detectRetina: true}).addTo(map);

//Show and hide attributes based on Funding Status
$('#Fund_St').on('click', function() {
  var fundedStatus = $('#Fund_St input[type="radio"]:checked').val();
  switch(fundedStatus) {
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

$.ajax({
  method: "GET",
  url: "/projects/edit/1",
  dataType: "json",
  success: function(data) {
    if (data) {
        console.log(data[0]);
        populateData(data[0]);
    }
  }
});

function populateData(project){
  populateCommon(project);
  switch(project.Fund_St){
    case 'Funded':
    $('#funded').prop('checked', true);
    $('#fundedAndUnfundedAttributes').show();
    $('#fundedAttributes').show();
    $('#unfundedAttributes').hide();
    populateFunded(project);
    break;

    case 'Unfunded':
    $('#unfunded').prop('checked', true);
    $('#fundedAndUnfundedAttributes').show();
    $('#fundedAttributes').hide();
    $('#unfundedAttributes').show();
    populateUnfunded(project)
    break;

    case 'Idea Project':
    $('#idea').prop('checked', true);
    $('#fundedAndUnfundedAttributes').hide();
    $('#fundedAttributes').hide();
    $('#unfundedAttributes').hide();
    break;

    case undefined:

    //will probably need to do something in case it's not set

    break;
  }
}

function populateCommon(project) {
  if (project.Fund_St != undefined) {
    $('#Fund_St input[type=radio][value="' + project.Fund_St + '"]').prop('checked', true);
  }
  if (project.Legacy_ID != undefined) {
    $('#Legacy_ID').val(project.Legacy_ID);
  }
  if (project.Lead_Ag != undefined) {
    $('#Lead_Ag').val(project.Lead_Ag);
  }
  if (project.Proj_Title != undefined) {
    $('#Proj_Title').val(project.Proj_Title);
  }
  if (project.Proj_Ty != undefined) {
    $('#Proj_Ty input[type=radio][value="' + project.Proj_Ty + '"]').prop('checked', true);
  }
  if (project.Proj_Desc != undefined) {
    $('#Proj_Desc').val(project.Proj_Desc);
  }
  if (project.Contact_info.Contact_info_name != undefined) {
    $('#Contact_info_name').val(project.Contact_info.Contact_info_name);
  }
  if (project.Contact_info.Contact_info_phone != undefined) {
    $('#Contact_info_phone').val(project.Contact_info.Contact_info_phone);
  }
  if (project.Contact_info.Contact_info_email != undefined) {
    $('#Contact_info_email').val(project.Contact_info.Contact_info_email);
  }
  if (project.More_info != undefined) {
    $('#More_info').val(project.More_info);
  }
  if (project.CD != undefined) {
    $('#CD').val(project.CD);
  }
}

function populateUnfunded(project) {
  if (project.Proj_Status != undefined) {
    $('#Proj_Status').val(project.Proj_Status);
  }
  if (project.Proj_Status != undefined) {
    $('#Proj_Man').val(project.Proj_Man);
  }
}

function populateFunded(project) {

};
