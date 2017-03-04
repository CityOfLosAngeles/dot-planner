'use strict';
module.exports = function(sequelize, DataTypes) {
  var Project = sequelize.define('Project', {
    ProjectTitle: DataTypes.STRING,
    ProjectDesc: DataTypes.STRING,
    Funded: DataTypes.BOOLEAN,
    Geotype: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Project.hasOne(Point, {
          onDelete: "CASCADE",
          hooks: true,
          foreignKey: {
            allowNull: false
          }
        })
      }
    }
  });
  return Project;
};