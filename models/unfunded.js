'use strict';
module.exports = function(sequelize, DataTypes) {
  var Unfunded = sequelize.define('Unfunded', {
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
        Unfunded.belongsTo(models.Detail,
          {
            foreignKey: 'detail_id',
            onDelete: 'CASCADE'
          }
        );
      }
    }
  });
  return Unfunded;
};
