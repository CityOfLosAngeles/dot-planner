'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Geometry: {
        type: Sequelize.JSONB
      },
      UID: {
        type: Sequelize.INTEGER
      },
      Proj_Title: {
        type: Sequelize.STRING
      },
      Proj_Desc: {
        type: Sequelize.STRING
      },
      Lead_Ag: {
        type: Sequelize.STRING
      },
      Fund_St: {
        type: Sequelize.STRING
      },
      Proj_Man: {
        type: Sequelize.STRING
      },
      Contact_info: {
        type: Sequelize.JSONB
      },
      More_info: {
        type: Sequelize.STRING
      },
      CD: {
        type: Sequelize.INTEGER
      },
      Access: {
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
    return queryInterface.dropTable('Details');
  }
};
