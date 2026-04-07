const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MedicalRecord extends Model {
    static associate(models) {
      MedicalRecord.belongsTo(models.Appointment, {
        foreignKey: "AppointmentId",
        as: "appointment",
      });
    }
  }

  MedicalRecord.init(
    {
      RecordId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      AppointmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Appointments",
          key: "AppointmentId",
        },
      },
      Diagnosis: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      Prescription: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      DoctorNotes: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "MedicalRecord",
      tableName: "MedicalRecords",
      timestamps: false,
    },
  );

  return MedicalRecord;
};
