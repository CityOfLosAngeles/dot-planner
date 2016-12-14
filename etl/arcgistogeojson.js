var arcgisToGeoJSON = require('arcgis-to-geojson-utils').arcgisToGeoJSON;
var geojsonToArcGIS = require('arcgis-to-geojson-utils').geojsonToArcGIS;

// parse ArcGIS JSON, convert it to GeoJSON
var geojson = arcgisToGeoJSON({
    "x":-13168633.785,
    "y":4031067.4799,
    "spatialReference": {
      "wkid": 4326
    }
  });

console.log(geojson);

//-13168633.785,4031067.4799
// // take GeoJSON and convert it to ArcGIS JSON
// var arcgis = geojsonToArcGIS({
//   "type": "Point",
//   "coordinates": [45.5165, -122.6764]
// });