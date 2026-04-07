"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("patients", {
      PatientId: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "Users",
          key: "Id",
        },
      },
      ReliabilityScore: {
        type: Sequelize.INTEGER,
        defaultValue: 100,
        validate: {
          min: 0,
        },
      },
      NoShowCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("patients");
  },
};
