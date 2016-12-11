'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Geometry: {
        type: Sequelize.JSONB
      },
      Fund_St: {
        type: Sequelize.STRING
      },
      Legacy_ID: {
        type: Sequelize.INTEGER
      },
      Lead_Ag: {
        type: Sequelize.STRING
      },
      Proj_Title: {
        type: Sequelize.STRING
      },
      Proj_Ty: {
        type: Sequelize.STRING
      },
      Proj_Desc: {
        type: Sequelize.STRING
      },
      Contact_info: {
        type: Sequelize.JSONB
      },
      More_info: {
        type: Sequelize.STRING
      },
      Primary_Street: {
        type: Sequelize.STRING
      },
      Cross_Streets: {
        type: Sequelize.JSONB
      },
      Proj_Status: {
        type: Sequelize.STRING
      },
      Proj_Man: {
        type: Sequelize.STRING
      },
      CD: {
        type: Sequelize.INTEGER
      },
      Access: {
        type: Sequelize.STRING
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
      Gas_Tax: {
        type: Sequelize.DECIMAL
      },
      General_fund: {
        type: Sequelize.DECIMAL
      },
      Authorization: {
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
      Grant_Cat: {
        type: Sequelize.STRING
      },
      Grant_Cycle: {
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
    return queryInterface.dropTable('Projects');
  }
};
