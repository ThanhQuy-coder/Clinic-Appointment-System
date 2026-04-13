/**
 * Nơi quản lý chuyển đổi trạng thái của job
 * Có 3 loại trạng thái: Waiting, Active, Completed
 */

const worker = require("./appointment.worker");
const { v4: uuidv4 } = require("uuid");
const emitter = require("../utils/emitter");

const queue = require("./appointment.queue");
const workerToken = uuidv4();

class QueueManager {
  async getNext() {
    const activeJobs = await queue.getActive();

    if (activeJobs.length > 0) {
      throw new Error("Chưa hoàn thành bệnh nhân hiện tại");
    }

    const currentJob = await worker.getNextJob(workerToken);

    if (!currentJob) {
      throw new Error("Hiện tại không có bệnh nhân");
    }

    const counts = await queue.getJobCounts();

    const currentNumber = counts.completed + 1;

    // Emit cho doctor
    emitter.emitToDoctor(currentJob.data.doctorId, {
      currentNumber,
      yourNumber: 0,
      numberAhead: counts.waiting,
      waitTime: counts.waiting * 15,
    });

    // Emit cho user đang khám
    emitter.emitToUser(currentJob.data.patientId, {
      currentNumber,
      yourNumber: 0,
      numberAhead: 0,
      waitTime: 0,
    });

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

    const waitingJobs = await queue.getWaiting();
    const counts = await queue.getJobCounts();

    const currentNumber = counts.completed; // vừa complete xong

    // Emit cho doctor
    emitter.emitToDoctor(currentJob.data.doctorId, {
      currentNumber,
      yourNumber: null,
      numberAhead: waitingJobs.length,
      waitTime: waitingJobs.length * 15,
    });

    // Emit cho từng user trong queue
    for (let i = 0; i < waitingJobs.length; i++) {
      const job = waitingJobs[i];

      emitter.emitToUser(job.data.patientId, {
        currentNumber,
        yourNumber: i + 1,
        numberAhead: i,
        waitTime: i * 15,
      });
    }

    return {
      id: currentJob.id,
      doctorId: currentJob.data.doctorId,
      patientId: currentJob.data.patientId,
      appointmentId: currentJob.data.appointmentId,
      status: "COMPLETED",
    };
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

  async addJob({ doctorId, patientId, appointmentId }) {
    if (!appointmentId) {
      throw new Error("appointmentId is required");
    }

    const jobId = `appointment_${appointmentId}`;

    return queue.add(
      "new_appointment",
      {
        doctorId,
        patientId,
        appointmentId,
      },
      { jobId },
    );
  }

  async getQueueStatus(appointmentId) {
    const job = await queue.getJob(`appointment_${appointmentId}`);

    if (!job) {
      throw new Error(`Không tìm thấy Job với ID: ${appointmentId}`);
    }

    const state = await job.getState();

    let position = null;
    let jobsAhead = 0;

    if (state === "waiting" || state === "prioritized") {
      // Lấy danh sách ID đang chờ xử lý
      const waitingJobs = await queue.getWaiting();

      const index = waitingJobs.findIndex(
        (job) => job.id === `appointment_${appointmentId}`,
      );

      if (index !== -1) {
        position = index + 1;
        jobsAhead = index;
      }
    }

    const counts = await queue.getJobCounts();

    return {
      currentNumber: counts.active === 0 ? "Chưa khám" : counts.active,
      yourNumber: position !== null ? position + counts.active : null,
      numberAhead: position !== null ? jobsAhead : null,
      waitTime: position !== null ? (position - 1) * 15 : 0,
    };
  }
}

module.exports = new QueueManager();
