#!/bin/bash

# Geodatabase to postgres
ogr2ogr -f "PostgreSQL" PG:"host=localhost port=5432 dbname=SampleNY user=postgres" path/to/geodatabase_file.gdb -overwrite -progress --config PG_USE_COPY YES

# Shapefile to Geojson
ogr2ogr -f GeoJSON -t_srs crs:84 [name].geojson [name].shp

## To install ogr2ogr on a mac, run `brew install gdal`
