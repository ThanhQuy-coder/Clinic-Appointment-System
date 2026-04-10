'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Patients', [
      {
        PatientId: '31a94a68-4a93-45cd-9e00-4f30c3e1be3b',
        ReliabilityScore: 100,
        NoShowCount: 0,
      },
      {
        PatientId: '106bb68e-edb6-45f6-a4a1-afa51efdc653',
        ReliabilityScore: 95,
        NoShowCount: 1,
      },
      {
        PatientId: '23045159-a02a-4520-b5e4-80ccde72cfb7',
        ReliabilityScore: 90,
        NoShowCount: 2,
      },
      {
        PatientId: '5db7be70-f0db-4ec1-98e5-9c9b3ff13af8',
        ReliabilityScore: 85,
        NoShowCount: 3,
      },
      {
        PatientId: '67ac3fa5-f780-4080-9461-acb2c865fcf7',
        ReliabilityScore: 100,
        NoShowCount: 0,
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Patients', {
      PatientId: [
        '31a94a68-4a93-45cd-9e00-4f30c3e1be3b',
        '106bb68e-edb6-45f6-a4a1-afa51efdc653',
        '23045159-a02a-4520-b5e4-80ccde72cfb7',
        '5db7be70-f0db-4ec1-98e5-9c9b3ff13af8',
        '67ac3fa5-f780-4080-9461-acb2c865fcf7',
      ]
    }, {});
  }
};