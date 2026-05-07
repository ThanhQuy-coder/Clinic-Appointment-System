const { Worker } = require("bullmq");
const connection = require("../config/redis");
const emitter = require("../utils/emitter");

const notificationWorker = new Worker(
  "notification_queue",
  async (job) => {
    const { userId, type = "SYSTEM", message, title = "Thông báo hệ thống", meta = {} } = job.data;
    const payload = {
      type,
      title,
      message,
      meta,
      sendingTime: new Date().toISOString(),
    };

    console.log(`[NOTIFY][${type}] ${userId}: ${title} - ${message}`);
    emitter.emitNotificationToUser(userId, payload);
  },
  {
    connection,
    autorun: true, 
  }
);

module.exports = notificationWorker;