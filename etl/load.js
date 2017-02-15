//var f_lines = require("../data/atd_f_lines.geojson")
//#require("../data/atd_f_multipoints.geojson")
//require("../data/atd_f_points.geojson")
//require("../data/atd_f_multipoints.geojson")
//require("../data/atd_uf_lines.geojson")
//require("../data/atd_uf_points.geojson")
//require("../data/atd_uf_polygon.geojson")
//

var fs = require("fs");

var contents = fs.readFileSync("../data/atd_f_lines.geojson")

var jsonContent = JSON.parse(contents);
