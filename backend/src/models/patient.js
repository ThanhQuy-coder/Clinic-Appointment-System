const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    static associate(models) {
      Patient.belongsTo(models.User, {
        foreignKey: "PatientId",
        targetKey: "Id",
        as: "user",
      });
      Patient.hasMany(models.Appointment, {
        foreignKey: "PatientId",
        as: "appointments",
      });
    }
  }

  Patient.init(
    {
      PatientId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "Users",
          key: "Id",
        },
      },
      ReliabilityScore: {
        type: DataTypes.INTEGER,
        defaultValue: 100,
        validate: {
          min: 0,
        },
      },
      NoShowCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
    },
    {
      sequelize,
      modelName: "Patient",
      tableName: "Patients",
      timestamps: false,
    },
  );

  return Patient;
};
