'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Doctors', [
      {
        DoctorId: 'd98f253c-5465-4acc-9ee2-5471269c85fe',
        Specialty: 'Cardiology',
        DefaultBufferTime: 10,
      },
      {
        DoctorId: '00e19264-63be-4592-b2c4-625e0abee762',
        Specialty: 'Dermatology',
        DefaultBufferTime: 5,
      },
      {
        DoctorId: 'cfb26a49-221e-4868-831b-4250644488a4',
        Specialty: 'Neurology',
        DefaultBufferTime: 15,
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Doctors', {
      DoctorId: [
        'd98f253c-5465-4acc-9ee2-5471269c85fe',
        '00e19264-63be-4592-b2c4-625e0abee762',
        'cfb26a49-221e-4868-831b-4250644488a4',
      ]
    }, {});
  }
};