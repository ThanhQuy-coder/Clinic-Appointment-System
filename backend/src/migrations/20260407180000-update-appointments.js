"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Appointments", "IsEmergency", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      after: "Status",
    });

    await queryInterface.addColumn("Appointments", "CancelledAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("Appointments", "CancelReason", {
      type: Sequelize.STRING(500),
      allowNull: true,
    });

    await queryInterface.addIndex("appointments", ["DoctorId", "StartTime"], {
      name: "idx_doctor_start",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("Appointments", "idx_doctor_start");
    await queryInterface.removeColumn("Appointments", "IsEmergency");
    await queryInterface.removeColumn("Appointments", "CancelledAt");
    await queryInterface.removeColumn("Appointments", "CancelReason");
  },
};