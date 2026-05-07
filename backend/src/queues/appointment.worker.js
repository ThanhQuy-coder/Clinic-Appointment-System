/**
 * Khởi tạo worker
 */

const { Worker } = require("bullmq");
const connection = require("../config/redis");

const workerByDoctor = (doctorId) => {
  return new Worker(
    `appointment_queue_${doctorId}`,
    async (job) => {
      console.log("Handle appointment:", job.data);
    },
    {
      connection,
      autorun: false,
      lockDuration: 1000 * 60 * 60,
    },
  );
};

module.exports = workerByDoctor;
