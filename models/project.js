'use strict';
module.exports = function(sequelize, DataTypes) {

    var Project = sequelize.define('Project', {
        Geometry: DataTypes.JSONB,
        Fund_St: DataTypes.STRING(1000),
        Legacy_ID: DataTypes.STRING,
        Lead_Ag: DataTypes.STRING(1000),
        Proj_Title: DataTypes.STRING(1000),
        Proj_Ty: DataTypes.STRING(1000),
        Proj_Desc: DataTypes.STRING(1000),
        Contact_info: DataTypes.JSONB,
        More_info: DataTypes.STRING(1000),
        Primary_Street: DataTypes.STRING(1000),
        Cross_Streets: DataTypes.JSONB,
        Proj_Status: DataTypes.STRING(1000),
        Proj_Man: DataTypes.STRING(1000),
        CD: DataTypes.STRING(1000),
        Access: DataTypes.STRING(1000),
        Dept_Proj_ID: DataTypes.STRING,
        Other_ID: DataTypes.STRING,
        Total_bgt: DataTypes.DECIMAL,
        Grant: DataTypes.DECIMAL,
        Other_funds: DataTypes.DECIMAL,
        Prop_c: DataTypes.DECIMAL,
        Measure_r: DataTypes.DECIMAL,
        Gas_Tax: DataTypes.DECIMAL,
        General_fund: DataTypes.DECIMAL,
        Authorization: DataTypes.STRING(1000),
        Issues: DataTypes.STRING(1000),
        Deobligation: DataTypes.STRING(1000),
        Explanation: DataTypes.STRING(1000),
        Constr_by: DataTypes.STRING(1000),
        Info_source: DataTypes.STRING(1000),
        Grant_Cat: DataTypes.STRING(1000),
        Grant_Cycle: DataTypes.STRING(1000),
        Est_Cost: DataTypes.DECIMAL,
        Fund_Rq: DataTypes.DECIMAL,
        Lc_match: DataTypes.DECIMAL,
        Flagged: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        TotalUnmetFunding: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        ProjectStartDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        ProjectProjectedCompletionDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        Dup_ID: DataTypes.INTEGER,
        Attachment: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }
    });
    return Project;
};