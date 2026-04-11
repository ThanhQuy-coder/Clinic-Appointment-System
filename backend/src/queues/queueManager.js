/**
 * Dùng quản lý các lớp liên quan đến lịch hẹn
 */

const { Queue } = require("bullmq");
const connection = require("../config/redis.js");

class QueueManager {
  constructor() {
    this.queue = new Queue("appointment-queue", { connection });
  }

  async addJob(name, data) {
    return this.queue.add(name, data, {
      removeOnComplete: true, // Xóa nếu hoàn thành
      removeOnFail: true, // Xóa nếu thất bại
    });
  }
}

module.exports = new QueueManager();
