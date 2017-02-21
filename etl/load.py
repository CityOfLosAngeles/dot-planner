import psycopg2
import json 

conn = psycopg2.connect('dbname=dot host=localhost')

def json_loader(file_name):
    """
    Takes a file path, opens a json
    handler and dumps. 
    ret: 
        json object
    """
    with open('../data/' + file_name) as file: 
        package = json.load(file)
    return package

file_names = [
             "atd_f_lines.geojson", 
             "atd_f_points.geojson",
             "atd_uf_lines.geojson",
             "atd_uf_polygon.geojson",
             "atd_f_multipoints.geojson",   
             "atd_f_polygon.geojson",
             "atd_uf_points.geojson"
]

data = {file_name: json_loader(file_name) for file_name in file_names}


