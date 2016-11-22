'use strict';
module.exports = function(sequelize, DataTypes) {
  var Project = sequelize.define('Project', {
    uid: DataTypes.INTEGER,
    project_title: DataTypes.STRING,
    project_description: DataTypes.STRING,
    geometry: DataTypes.JSONB
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Project;
};
