'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const makeDate = (hour, minute = 0) => {
      const d = new Date('2026-04-13');
      d.setHours(hour, minute, 0, 0);
      return d;
    };

    await queryInterface.bulkInsert('Appointments', [
      // ===== Doctor 1 =====
      {
        PatientId: '31a94a68-4a93-45cd-9e00-4f30c3e1be3b',
        DoctorId: 'd98f253c-5465-4acc-9ee2-5471269c85fe',
        StartTime: makeDate(8, 0),
        EndTime: makeDate(8, 30),
        AppointmentType: 'General Checkup',
        Status: 'Confirmed',
        ActualStartTime: makeDate(8, 5),
        ActualEndTime: makeDate(8, 35),
        IsEmergency: false,
      },
      {
        PatientId: '106bb68e-edb6-45f6-a4a1-afa51efdc653',
        DoctorId: 'd98f253c-5465-4acc-9ee2-5471269c85fe',
        StartTime: makeDate(8, 30),
        EndTime: makeDate(9, 0),
        AppointmentType: 'Consultation',
        Status: 'Pending',
        IsEmergency: false,
      },
      {
        PatientId: '23045159-a02a-4520-b5e4-80ccde72cfb7',
        DoctorId: 'd98f253c-5465-4acc-9ee2-5471269c85fe',
        StartTime: makeDate(9, 0),
        EndTime: makeDate(9, 30),
        AppointmentType: 'Emergency',
        Status: 'Pending',
        IsEmergency: true,
      },

      // ===== Doctor 2 =====
      {
        PatientId: '5db7be70-f0db-4ec1-98e5-9c9b3ff13af8',
        DoctorId: '00e19264-63be-4592-b2c4-625e0abee762',
        StartTime: makeDate(10, 0),
        EndTime: makeDate(10, 30),
        AppointmentType: 'Skin Check',
        Status: 'Cancelled',
        CancelledAt: makeDate(9, 50),
        CancelReason: 'Patient busy',
        IsEmergency: false,
      },
      {
        PatientId: '67ac3fa5-f780-4080-9461-acb2c865fcf7',
        DoctorId: '00e19264-63be-4592-b2c4-625e0abee762',
        StartTime: makeDate(10, 30),
        EndTime: makeDate(11, 0),
        AppointmentType: 'Consultation',
        Status: 'NoShow',
        IsEmergency: false,
      },

      // ===== Doctor 3 =====
      {
        PatientId: '31a94a68-4a93-45cd-9e00-4f30c3e1be3b',
        DoctorId: 'cfb26a49-221e-4868-831b-4250644488a4',
        StartTime: makeDate(13, 0),
        EndTime: makeDate(13, 30),
        AppointmentType: 'Neurology Check',
        Status: 'Completed',
        ActualStartTime: makeDate(13, 0),
        ActualEndTime: makeDate(13, 25),
        IsEmergency: false,
      },
      {
        PatientId: '106bb68e-edb6-45f6-a4a1-afa51efdc653',
        DoctorId: 'cfb26a49-221e-4868-831b-4250644488a4',
        StartTime: makeDate(13, 30),
        EndTime: makeDate(14, 0),
        AppointmentType: 'Follow-up',
        Status: 'Confirmed',
        IsEmergency: false,
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Appointments', null, {});
  }
};