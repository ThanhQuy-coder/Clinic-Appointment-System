/**
 * * File cấu hình kết nối với Database Mysql
 */
require("dotenv").config({ path: __dirname + "/../../.env" });

module.exports = {
  development: {
    username: process.env.CLINIC_DB_USER || "root",
    password: process.env.CLINIC_DB_PASS || null,
    database: process.env.CLINIC_DB_NAME || "database_development",
    host: process.env.CLINIC_DB_HOST || "127.0.0.1",
    port: process.env.CLINIC_DB_PORT || 3306,
    dialect: "mysql",
  },
  production: {
    username: process.env.CLINIC_DB_USER,
    password: process.env.CLINIC_DB_PASS,
    database: process.env.CLINIC_DB_NAME,
    host: process.env.CLINIC_DB_HOST,
    dialect: "mysql",
  },
};
