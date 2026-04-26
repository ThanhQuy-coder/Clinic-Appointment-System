/**
 * Dùng quản lý các lớp liên quan đến lịch hẹn
 */

const { Queue } = require("bullmq");
const connection = require("../config/redis.js");

class QueueManager {
  constructor() {
    this.queue = null;
    this.isConnected = false;
    this.init();
  }

  async init() {
    if (!connection) {
      console.warn("Redis unavailable, queue features disabled");
      return;
    }
    try {
      this.queue = new Queue("appointment-queue", {
        connection,
        maxRetriesPerRequest: 1,
      });
      this.isConnected = true;
    } catch (error) {
      console.warn("Queue initialization failed:", error.message);
      this.isConnected = false;
    }
  }

  async addJob(name, data) {
    if (!this.isConnected || !this.queue) {
      return null;
    }
    try {
      return await this.queue.add(name, data, {
        removeOnComplete: true,
        removeOnFail: true,
      });
    } catch (error) {
      console.warn(`Queue job failed: ${name}`, error.message);
      return null;
    }
  }
}

module.exports = new QueueManager();
