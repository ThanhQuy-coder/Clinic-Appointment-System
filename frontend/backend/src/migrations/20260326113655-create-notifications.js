"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("notifications", {
      NotificationId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Title: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      Content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      SendingTime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      NotificationStatus: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("notifications");
  },
};
