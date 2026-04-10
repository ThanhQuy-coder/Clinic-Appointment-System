'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const baseDate = new Date('2026-04-13'); // Thứ 2 (DayOfWeek = "1")

    const makeTime = (dayOffset, hour, minute = 0) => {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + dayOffset);
      d.setHours(hour, minute, 0, 0);
      return d;
    };

    await queryInterface.bulkInsert('WorkSchedules', [
      // ===== Doctor 1 =====
      {
        DoctorId: 'd98f253c-5465-4acc-9ee2-5471269c85fe',
        DayOfWeek: "1",
        StartTime: makeTime(0, 8),
        EndTime: makeTime(0, 12),
        IsActive: true,
      },
      {
        DoctorId: 'd98f253c-5465-4acc-9ee2-5471269c85fe',
        DayOfWeek: "3",
        StartTime: makeTime(2, 13),
        EndTime: makeTime(2, 17),
        IsActive: true,
      },

      // ===== Doctor 2 =====
      {
        DoctorId: '00e19264-63be-4592-b2c4-625e0abee762',
        DayOfWeek: "2",
        StartTime: makeTime(1, 8),
        EndTime: makeTime(1, 12),
        IsActive: true,
      },
      {
        DoctorId: '00e19264-63be-4592-b2c4-625e0abee762',
        DayOfWeek: "4",
        StartTime: makeTime(3, 13),
        EndTime: makeTime(3, 17),
        IsActive: true,
      },

      // ===== Doctor 3 =====
      {
        DoctorId: 'cfb26a49-221e-4868-831b-4250644488a4',
        DayOfWeek: "5",
        StartTime: makeTime(4, 8),
        EndTime: makeTime(4, 12),
        IsActive: true,
      },
      {
        DoctorId: 'cfb26a49-221e-4868-831b-4250644488a4',
        DayOfWeek: "6",
        StartTime: makeTime(5, 13),
        EndTime: makeTime(5, 17),
        IsActive: true,
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('WorkSchedules', {
      DoctorId: [
        'd98f253c-5465-4acc-9ee2-5471269c85fe',
        '00e19264-63be-4592-b2c4-625e0abee762',
        'cfb26a49-221e-4868-831b-4250644488a4',
      ]
    }, {});
  }
};