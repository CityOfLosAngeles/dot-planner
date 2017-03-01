#!/bin/sh

set -e

#unzip ATD_projectdatabase.gdb.zip

# remove old geojson3

if [ -f ../data/atd_f_lines.geojson ] ; then
      rm ../data/*.geojson
fi

# remove temp tample 
psql -d dot -c "DROP TABLE ogrgeojson"

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
  ogr2ogr -append -f "PostgreSQL" PG:"host=localhost user=dot-planner dbname=dot password=dot-planner" ../data/atd_$i.geojson -nlt GEOMETRY
done

psql -d dot -c "SELECT * INTO Projects FROM ogrgeojson;"
