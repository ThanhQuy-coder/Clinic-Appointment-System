/**
 * queueProcessor: tạo worker dùng để xử lý các job trong queue cụ thể là "appointment-queue"
 */

const { Worker } = require("bullmq");
const connection = require("../config/redis");
const queueService = require("../services/queue.service.js");
const emitter = require("../utils/emitter");

// worker lắng nghe appointment-queue
const worker = new Worker(
  "appointment-queue",
  async (job) => {
    const { name, data } = job;

    // Xử lý từng loại job
    switch (name) {
      case "NEXT_PATIENT":        
        const result = await queueService.handleNext(data.doctorId);
        
        emitter.emitQueueUpdate(data.doctorId, result);
        break;

      case "NEW_APPOINTMENT":
        const queue = await queueService.addToQueue(data);

        emitter.emitQueueUpdate(data.doctorId, queue);
        break;

      case "CANCEL_APPOINTMENT":
        const updated = await queueService.removeFromQueue(data);

        emitter.emitQueueUpdate(data.doctorId, updated);
        break;
    }
  },
  { connection },
);

module.exports = worker;
