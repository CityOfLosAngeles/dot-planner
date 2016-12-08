'use strict';
module.exports = function(sequelize, DataTypes) {
  var Project = sequelize.define('Project', {
    Geometry: DataTypes.JSONB,
    UID: DataTypes.INTEGER,
    Proj_Title: DataTypes.STRING,
    Proj_Desc: DataTypes.STRING,
    Intersections: DataTypes.JSONB,
    Lead_Ag: DataTypes.STRING,
    Fund_St: DataTypes.STRING,
    Proj_Man: DataTypes.STRING,
    Contact_info: DataTypes.JSONB,
    More_info: DataTypes.STRING,
    CD: DataTypes.INTEGER,
    Access: DataTypes.STRING,
    Dept_Proj_ID: DataTypes.INTEGER,
    Total_bgt: DataTypes.DECIMAL,
    Grant: DataTypes.DECIMAL,
    Other_funds: DataTypes.DECIMAL,
    Prop_c: DataTypes.DECIMAL,
    Measure_r: DataTypes.DECIMAL,
    General_fund: DataTypes.DECIMAL,
    Current_Status: DataTypes.STRING,
    Issues: DataTypes.STRING,
    Deobligation: DataTypes.STRING,
    Explanation: DataTypes.STRING,
    Other_ID: DataTypes.INTEGER,
    Constr_by: DataTypes.STRING,
    Info_source: DataTypes.STRING,
    Grant_Cat: DataTypes.STRING,
    Proj_Ty: DataTypes.STRING,
    Est_Cost: DataTypes.DECIMAL,
    Fund_Rq: DataTypes.DECIMAL,
    Lc_match: DataTypes.DECIMAL,
    Match_Pt: DataTypes.INTEGER,
    Comments: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Project;
};
