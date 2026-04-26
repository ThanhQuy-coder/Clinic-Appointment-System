/**
 * Cấu hình kết nối ioredis
 * yêu cầu thiết lập sẵn hai biến: IOREDIS_HOST, IOREDIS_PORT
 */

const { Redis } = require("ioredis");
require("dotenv").config({ path: __dirname + "/../../.env" });

const redisConfig = {
  host: process.env.IOREDIS_HOST || "127.0.0.1",
  port: process.env.IOREDIS_PORT || 6379,
  maxRetriesPerRequest: 1,
  enableReadyCheck: false,
  retryStrategy: () => null,
  connectTimeout: 3000,
  lazyConnect: true,
  showFriendlyErrorStack: false,
};

let connection = null;

try {
  const RedisClient = new Redis(redisConfig);
  RedisClient.on("error", () => {});
  RedisClient.on("close", () => {});
  RedisClient.on("end", () => {});
  connection = RedisClient;
} catch (error) {
  connection = null;
}

module.exports = connection;
