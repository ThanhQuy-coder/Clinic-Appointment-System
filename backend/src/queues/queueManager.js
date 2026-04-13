/**
 * Nơi quản lý chuyển đổi trạng thái của job
 * Có 3 loại trạng thái: Waiting, Active, Completed
 */

const worker = require("./appointment.worker");
const { Queue } = require("bullmq");
const connection = require("../config/redis");
const { v4: uuidv4 } = require("uuid");

const queue = new Queue("appointment_queue", { connection });
const workerToken = uuidv4();

class QueueManager {
  async getNext() {
    const activeJobs = await queue.getActive();

    if (activeJobs.length > 0) {
      throw new Error("Chưa hoàn thành bệnh nhân hiện tại");
    }

    const currentJob = await worker.getNextJob(workerToken);

    if (!currentJob) {
      return null;
    }

    return {
      id: currentJob.id,
      doctorId: currentJob.data.doctorId,
      patientId: currentJob.data.patientId,
      appointmentId: currentJob.data.appointmentId,
      status: "ACTIVE",
    };
  }

  async complete() {
    const activeJobs = await queue.getActive();

    if (!activeJobs || activeJobs.length === 0) {
      throw new Error("Không có bệnh nhân đang khám");
    }

    const currentJob = activeJobs[0];

    await currentJob.moveToCompleted("DONE", workerToken);

    const result = {
      id: currentJob.id,
      doctorId: currentJob.data.doctorId,
      patientId: currentJob.data.patientId,
      appointmentId: currentJob.data.appointmentId,
      status: "COMPLETED",
    };
    
    return result;
  }

  async getCurrent() {
    const activeJobs = await queue.getActive();

    if (activeJobs.length === 0)
      throw new Error("Không có bệnh nhân đang khám");

    const job = activeJobs[0];

    // console.log(job.id);

    return {
      id: job.id,
      doctorId: job.data.doctorId,
      patientId: job.data.patientId,
      status: "ACTIVE",
    };
  }

  async addJob(doctorId, patientId, appointmentId) {
    const appointmentQueue = require("../queues/appointment.queue");

    return appointmentQueue.add("new_appointment", {
      doctorId,
      patientId,
      appointmentId,
    });
  }
}

module.exports = new QueueManager();
