'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Fundeds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Dept_Proj_ID: {
        type: Sequelize.INTEGER
      },
      Total_bgt: {
        type: Sequelize.DECIMAL
      },
      Grant: {
        type: Sequelize.DECIMAL
      },
      Other_funds: {
        type: Sequelize.DECIMAL
      },
      Prop_c: {
        type: Sequelize.DECIMAL
      },
      Measure_r: {
        type: Sequelize.DECIMAL
      },
      General_fund: {
        type: Sequelize.DECIMAL
      },
      Current_Status: {
        type: Sequelize.STRING
      },
      Issues: {
        type: Sequelize.STRING
      },
      Deobligation: {
        type: Sequelize.STRING
      },
      Explanation: {
        type: Sequelize.STRING
      },
      Other_ID: {
        type: Sequelize.INTEGER
      },
      Constr_by: {
        type: Sequelize.STRING
      },
      Info_source: {
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
    return queryInterface.dropTable('Fundeds');
  }
};
