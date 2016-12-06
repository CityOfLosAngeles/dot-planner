'use strict';
module.exports = function(sequelize, DataTypes) {
  var Detail = sequelize.define('Detail', {
    Geometry: DataTypes.JSONB,
    UID: DataTypes.INTEGER,
    Proj_Title: DataTypes.STRING,
    Proj_Desc: DataTypes.STRING,
    Lead_Ag: DataTypes.STRING,
    Fund_St: DataTypes.STRING,
    Proj_Man: DataTypes.STRING,
    Contact_info: DataTypes.JSONB,
    More_info: DataTypes.STRING,
    CD: DataTypes.INTEGER,
    Access: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Detail;
};
