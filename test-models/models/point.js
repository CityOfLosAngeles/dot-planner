// 'use strict';
module.exports = function(sequelize, DataTypes) {
  var Point = sequelize.define('Point', {
    Shape: DataTypes.GEOMETRY("POINT"),
    CID: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
          Point.belongsTo(models.Project, {
            onDelete: "CASCADE",
            foreignKey: {
              allowNull: false
            }
          })
      }
    }
  });
  return Point;
};