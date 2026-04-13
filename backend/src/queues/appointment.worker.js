/**
 * Khởi tạo worker
 */

const { Worker } = require("bullmq");
const connection = require("../config/redis");

const worker = new Worker(
  "appointment_queue",
  async (job) => {
    // Chỉ chạy khi job completed (optional)
    return { message: "Khám bệnh hoàn tất" };
  },
  {
    connection,
    autorun: false,
    lockDuration: 1000 * 60 * 60, // 1 tiếng
  },
);

module.exports = worker;
