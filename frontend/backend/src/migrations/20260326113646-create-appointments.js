"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("appointments", {
      AppointmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      PatientId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Patients",
          key: "PatientId",
        },
      },
      DoctorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Doctors",
          key: "DoctorId",
        },
      },
      StartTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      EndTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      AppointmentType: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      Status: {
        type: Sequelize.STRING(50),
        defaultValue: "Pending",
      },
      ActualStartTime: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      ActualEndTime: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("appointments");
  },
};
