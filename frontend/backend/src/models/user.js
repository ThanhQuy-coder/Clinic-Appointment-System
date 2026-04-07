const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Patient, { foreignKey: "PatientId", as: "patient" });
      User.hasOne(models.Doctor, { foreignKey: "DoctorId", as: "doctor" });
    }
  }

  User.init(
    {
      Id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      FullName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      Phone: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
      },
      Email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      PasswordHash: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      Role: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          isIn: [["Admin", "Patient", "Doctor"]],
        },
      },
      CreatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      UpdatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
      timestamps: false,
      underscored: false,
      indexes: [
        { name: "idx_fullname", fields: ["FullName"] },
        { name: "idx_role", fields: ["Role"] },
        { name: "idx_created_at", fields: ["CreatedAt"] },
      ],
    },
  );

  return User;
};
