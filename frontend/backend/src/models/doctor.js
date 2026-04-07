const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    static associate(models) {
      Doctor.belongsTo(models.User, {
        foreignKey: "DoctorId",
        targetKey: "Id",
        as: "user",
      });
      Doctor.hasMany(models.Appointment, {
        foreignKey: "DoctorId",
        as: "appointments",
      });
      Doctor.hasMany(models.WorkSchedule, {
        foreignKey: "DoctorId",
        as: "schedules",
      });
      Doctor.hasMany(models.DoctorLeave, {
        foreignKey: "DoctorId",
        as: "leaves",
      });
    }
  }

  Doctor.init(
    {
      DoctorId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "Users",
          key: "Id",
        },
      },
      Specialty: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      DefaultBufferTime: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
    },
    {
      sequelize,
      modelName: "Doctor",
      tableName: "Doctors",
      timestamps: false,
    },
  );

  return Doctor;
};
