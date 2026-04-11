"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("medicalRecords", {
      RecordId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      AppointmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Appointments",
          key: "AppointmentId",
        },
      },
      Diagnosis: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      Prescription: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      DoctorNotes: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("medicalRecords");
  },
};
