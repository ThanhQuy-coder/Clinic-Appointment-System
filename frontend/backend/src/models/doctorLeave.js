const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class DoctorLeave extends Model {
    static associate(models) {
      DoctorLeave.belongsTo(models.Doctor, {
        foreignKey: "DoctorId",
        as: "doctor",
      });
    }
  }

  DoctorLeave.init(
    {
      Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      DoctorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Doctors",
          key: "DoctorId",
        },
      },
      StartTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      EndTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      Reason: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      Status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: "DoctorLeave",
      tableName: "DoctorLeaves",
      timestamps: false,
    },
  );

  return DoctorLeave;
};
