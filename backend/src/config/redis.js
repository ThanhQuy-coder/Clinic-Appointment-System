/**
 * Cấu hình kết nối ioredis
 * yêu cầu thiết lập sẵn hai biến: IOREDIS_HOST, IOREDIS_PORT
 */

const { Redis } = require("ioredis");
require("dotenv").config({ path: __dirname + "/../../.env" });

const connection = new Redis({
  host: process.env.IOREDIS_HOST,
  port: process.env.IOREDIS_PORT,
  maxRetriesPerRequest: null,
});

module.exports = connection;
