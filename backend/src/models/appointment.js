const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    static associate(models) {
      Appointment.belongsTo(models.Patient, {
        foreignKey: "PatientId",
        as: "patient",
      });
      Appointment.belongsTo(models.Doctor, {
        foreignKey: "DoctorId",
        as: "doctor",
      });
      Appointment.hasOne(models.MedicalRecord, {
        foreignKey: "AppointmentId",
        as: "medicalRecord",
      });
    }
  }

  Appointment.init(
    {
      AppointmentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      PatientId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Patients",
          key: "PatientId",
        },
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
      AppointmentType: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      Status: {
        type: DataTypes.STRING(50),
        defaultValue: "Pending",
      },
      ActualStartTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      ActualEndTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Appointment",
      tableName: "Appointments",
      timestamps: false,
    },
  );

  return Appointment;
};
