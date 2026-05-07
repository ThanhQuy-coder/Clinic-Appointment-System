const { Queue } = require("bullmq");
const connection = require("../config/redis");

const notificationQueue = new Queue("notification_queue", {
  connection,
});

module.exports = notificationQueue;