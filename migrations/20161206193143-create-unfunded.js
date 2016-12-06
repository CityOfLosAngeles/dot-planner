'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Unfundeds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Grant_Cat: {
        type: Sequelize.STRING
      },
      Proj_Ty: {
        type: Sequelize.STRING
      },
      Est_Cost: {
        type: Sequelize.DECIMAL
      },
      Fund_Rq: {
        type: Sequelize.DECIMAL
      },
      Lc_match: {
        type: Sequelize.DECIMAL
      },
      Match_Pt: {
        type: Sequelize.INTEGER
      },
      Comments: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Unfundeds');
  }
};
