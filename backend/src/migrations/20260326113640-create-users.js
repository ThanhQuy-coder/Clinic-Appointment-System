"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      Id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      FullName: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      Phone: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true,
      },
      Email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      PasswordHash: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      Role: {
        type: Sequelize.STRING(10),
        allowNull: false,
        validate: {
          isIn: [["Admin", "Patient", "Doctor"]],
        },
      },
      CreatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      UpdatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
