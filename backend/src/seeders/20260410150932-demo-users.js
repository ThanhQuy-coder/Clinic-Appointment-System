'use strict';

// Mật khẩu cho tất cả là: 123456

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('Users', [
      // ===== Admin =====
      {
        Id: "f7f48fcd-ba9e-4df2-bfb0-254aeea62dff",
        FullName: 'Admin System',
        Phone: '0900000001',
        Email: 'admin@gmail.com',
        PasswordHash: 'gAAAAABp2ROBxKYVIOJKwQQC-H0ieEzZqt3NmvPzGUsRQjg_2JLWzqkkyOGStCI4zqe9wFDxrOsF0nJGEoFgk7ZBpHKwdaYzxA==',
        Role: 'Admin',
        CreatedAt: now,
        UpdatedAt: now,
      },

      // ===== Doctors =====
      {
        Id: "d98f253c-5465-4acc-9ee2-5471269c85fe",
        FullName: 'Dr. Nguyễn Văn A',
        Phone: '0900000002',
        Email: 'doctor1@gmail.com',
        PasswordHash: 'gAAAAABp2ROBxKYVIOJKwQQC-H0ieEzZqt3NmvPzGUsRQjg_2JLWzqkkyOGStCI4zqe9wFDxrOsF0nJGEoFgk7ZBpHKwdaYzxA==',
        Role: 'Doctor',
        CreatedAt: now,
        UpdatedAt: now,
      },
      {
        Id: "00e19264-63be-4592-b2c4-625e0abee762",
        FullName: 'Dr. Trần Thị B',
        Phone: '0900000003',
        Email: 'doctor2@gmail.com',
        PasswordHash: 'gAAAAABp2ROBxKYVIOJKwQQC-H0ieEzZqt3NmvPzGUsRQjg_2JLWzqkkyOGStCI4zqe9wFDxrOsF0nJGEoFgk7ZBpHKwdaYzxA==',
        Role: 'Doctor',
        CreatedAt: now,
        UpdatedAt: now,
      },
      {
        Id: "cfb26a49-221e-4868-831b-4250644488a4",
        FullName: 'Dr. Lê Văn C',
        Phone: '0900000004',
        Email: 'doctor3@gmail.com',
        PasswordHash: 'gAAAAABp2ROBxKYVIOJKwQQC-H0ieEzZqt3NmvPzGUsRQjg_2JLWzqkkyOGStCI4zqe9wFDxrOsF0nJGEoFgk7ZBpHKwdaYzxA==',
        Role: 'Doctor',
        CreatedAt: now,
        UpdatedAt: now,
      },

      // ===== Patients =====
      {
        Id: "31a94a68-4a93-45cd-9e00-4f30c3e1be3b",
        FullName: 'Phạm Văn D',
        Phone: '0900000005',
        Email: 'patient1@gmail.com',
        PasswordHash: 'gAAAAABp2ROBxKYVIOJKwQQC-H0ieEzZqt3NmvPzGUsRQjg_2JLWzqkkyOGStCI4zqe9wFDxrOsF0nJGEoFgk7ZBpHKwdaYzxA==',
        Role: 'Patient',
        CreatedAt: now,
        UpdatedAt: now,
      },
      {
        Id: "106bb68e-edb6-45f6-a4a1-afa51efdc653",
        FullName: 'Nguyễn Thị E',
        Phone: '0900000006',
        Email: 'patient2@gmail.com',
        PasswordHash: 'gAAAAABp2ROBxKYVIOJKwQQC-H0ieEzZqt3NmvPzGUsRQjg_2JLWzqkkyOGStCI4zqe9wFDxrOsF0nJGEoFgk7ZBpHKwdaYzxA==',
        Role: 'Patient',
        CreatedAt: now,
        UpdatedAt: now,
      },
      {
        Id: "23045159-a02a-4520-b5e4-80ccde72cfb7",
        FullName: 'Lê Văn F',
        Phone: '0900000007',
        Email: 'patient3@gmail.com',
        PasswordHash: 'gAAAAABp2ROBxKYVIOJKwQQC-H0ieEzZqt3NmvPzGUsRQjg_2JLWzqkkyOGStCI4zqe9wFDxrOsF0nJGEoFgk7ZBpHKwdaYzxA==',
        Role: 'Patient',
        CreatedAt: now,
        UpdatedAt: now,
      },
      {
        Id: "5db7be70-f0db-4ec1-98e5-9c9b3ff13af8",
        FullName: 'Trần Thị G',
        Phone: '0900000008',
        Email: 'patient4@gmail.com',
        PasswordHash: 'gAAAAABp2ROBxKYVIOJKwQQC-H0ieEzZqt3NmvPzGUsRQjg_2JLWzqkkyOGStCI4zqe9wFDxrOsF0nJGEoFgk7ZBpHKwdaYzxA==',
        Role: 'Patient',
        CreatedAt: now,
        UpdatedAt: now,
      },
      {
        Id: "67ac3fa5-f780-4080-9461-acb2c865fcf7",
        FullName: 'Hoàng Văn H',
        Phone: '0900000009',
        Email: 'patient5@gmail.com',
        PasswordHash: 'gAAAAABp2ROBxKYVIOJKwQQC-H0ieEzZqt3NmvPzGUsRQjg_2JLWzqkkyOGStCI4zqe9wFDxrOsF0nJGEoFgk7ZBpHKwdaYzxA==',
        Role: 'Patient',
        CreatedAt: now,
        UpdatedAt: now,
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      Email: [
        'admin@gmail.com',
        'doctor1@gmail.com',
        'doctor2@gmail.com',
        'doctor3@gmail.com',
        'patient1@gmail.com',
        'patient2@gmail.com',
        'patient3@gmail.com',
        'patient4@gmail.com',
        'patient5@gmail.com',
      ]
    }, {});
  }
};