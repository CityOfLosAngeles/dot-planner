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
        type: Sequelize.STRING(1000)
      },
      Legacy_ID: {
        type: Sequelize.STRING
      },
      Lead_Ag: {
        type: Sequelize.STRING(1000)
      },
      Proj_Title: {
        type: Sequelize.STRING(1000)
      },
      Proj_Ty: {
        type: Sequelize.STRING(1000)
      },
      Proj_Desc: {
        type: Sequelize.STRING(1000)
      },
      Contact_info: {
        type: Sequelize.JSONB
      },
      More_info: {
        type: Sequelize.STRING(1000)
      },
      Primary_Street: {
        type: Sequelize.STRING(1000)
      },
      Cross_Streets: {
        type: Sequelize.JSONB
      },
      Proj_Status: {
        type: Sequelize.STRING(1000)
      },
      Proj_Man: {
        type: Sequelize.STRING(1000)
      },
      CD: {
        type: Sequelize.STRING
      },
      Access: {
        type: Sequelize.STRING(1000)
      },
      Dept_Proj_ID: {
        type: Sequelize.STRING
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
        type: Sequelize.STRING(1000)
      },
      Issues: {
        type: Sequelize.STRING(1000)
      },
      Deobligation: {
        type: Sequelize.STRING(1000)
      },
      Explanation: {
        type: Sequelize.STRING(1000)
      },
      Other_ID: {
        type: Sequelize.STRING
      },
      Constr_by: {
        type: Sequelize.STRING(1000)
      },
      Info_source: {
        type: Sequelize.STRING(1000)
      },
      Grant_Cat: {
        type: Sequelize.STRING(1000)
      },
      Grant_Cycle: {
        type: Sequelize.STRING(1000)
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
      Flagged: {
        type: Sequelize.BOOLEAN
      },
      Dup_ID: {
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
