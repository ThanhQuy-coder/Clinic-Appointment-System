const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class WorkSchedule extends Model {
    static associate(models) {
      WorkSchedule.belongsTo(models.Doctor, {
        foreignKey: "DoctorId",
        as: "doctor",
      });
    }
  }

  WorkSchedule.init(
    {
      ScheduleId: {
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
      DayOfWeek: {
        type: DataTypes.ENUM("0", "1", "2", "3", "4", "5", "6"), // 0=CN → 6=Thứ 7
        allowNull: false,
      },
      StartTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      EndTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      IsActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "WorkSchedule",
      tableName: "WorkSchedules",
      timestamps: false,
    },
  );

  return WorkSchedule;
};
