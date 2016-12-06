'use strict';
module.exports = function(sequelize, DataTypes) {
  var Funded = sequelize.define('Funded', {
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
    Info_source: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Funded;
};
