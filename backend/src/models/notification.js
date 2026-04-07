const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {}

  Notification.init(
    {
      NotificationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Title: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      Content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      SendingTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      NotificationStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: "Notification",
      tableName: "Notifications",
      timestamps: false,
    },
  );

  return Notification;
};
