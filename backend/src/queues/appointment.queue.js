/**
 * Khởi tạo Queue
 * Mỗi Queue thuộc về duy nhất 1 bác sĩ
 */

const { Queue } = require("bullmq");
const connection = require("../config/redis");

// Hàm tạo hoặc lấy Queue theo Doctor ID
const getQueueByDoctor = (doctorId) => {
  if (!doctorId) throw new Error("Cần doctorId để khởi tạo Queue");

  return new Queue(`appointment_queue_${doctorId}`, {
    connection,
  });
};

module.exports = getQueueByDoctor;
