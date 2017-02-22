#!/bin/sh

set -e

#unzip ATD_projectdatabase.gdb.zip

declare -a arr=("f_multipoints"
                "f_points"
                "f_lines"
                "f_polygon"
                "uf_points"
                "uf_lines"
                "uf_polygon")

## now loop through the above array to make geojson files
for i in "${arr[@]}"
do
  echo "$i"
  ogr2ogr -sql "SELECT * FROM $i" -f "GeoJSON" ../data/atd_$i.geojson ../data/ATD_projectdatabase.gdb
done

node load.js


