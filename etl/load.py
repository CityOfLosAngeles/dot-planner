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

# Load in the json
data = {file_name: json_loader(file_name) for file_name in file_names}

#load f_lines 
for project in data['atd_f_lines']['features']:
    cur.execute("""INSERT INTO Projects (Geometry,
                                         Fund_St,
                                         Legacy_ID,
                                         Lead_Ag,
                                         Proj_Title,
                                         Proj_Ty,
                                         Proj_Desc,
                                         Contact_info,
                                         More_info,
                                         Primary_Street,
                                         Cross_Streets,
                                         Proj_Status,
                                         Proj_Man,
                                         CD,
                                         Access,
                                         Dept_Proj_ID,
                                         Other_ID,
                                         Total_bgt,
                                         Grant,
                                         Other_funds,
                                         Prop_c,
                                         Measure_r,
                                         Gas_Tax,
                                         General_fund,
                                         Authorization,
                                         Issues,
                                         Deobligation,
                                         Explanation,
                                         Constr_by,
                                         Info_source,
                                         Grant_Cat,
                                         Grant_Cycle,
                                         Est_Cost,
                                         Fund_Rq,
                                         Lc_match,
                                         Flagged,
                                         Dup_ID) VALUES 
                                         (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                                         """,
                                         project['geometry'], 
                                         "funded",
                                         )
                                         

