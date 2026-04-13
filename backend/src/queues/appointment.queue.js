/**
 * Khởi tạo Queue
 * Mỗi Queue thuộc về duy nhất 1 bác sĩ
 */

const { Queue } = require("bullmq");
const connection = require("../config/redis");

const appointmentQueue = new Queue("appointment_queue", {
  connection,
});

module.exports = appointmentQueue;
