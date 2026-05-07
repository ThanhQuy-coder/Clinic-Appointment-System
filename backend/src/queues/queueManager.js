/**
 * Nơi quản lý chuyển đổi trạng thái của job
 * Có 3 loại trạng thái: Waiting, Active, Completed
 */

const emitter = require("../utils/emitter");
const getQueueByDoctor = require("./appointment.queue");
const workerByDoctor = require("./appointment.worker");
const notificationService = require("../services/notification.service");
const { v4: uuidv4 } = require("uuid");
const workerToken = uuidv4();

class QueueManager {
  /**
   * Xử lý chuyển đến bệnh nhân tiếp theo khi chưa có bệnh nhân khám
   * @param {String} doctorId
   * @returns
   */
  async getNext(doctorId) {
    // Ràng buộc cơ bản
    const queue = getQueueByDoctor(doctorId);
    const waitingJobs = await queue.getWaiting();

    if (!waitingJobs || waitingJobs.length === 0) {
      throw new Error("Hiện tại không có bệnh nhân");
    }

    const activeJob = waitingJobs.find((j) => j.data.status === "ACTIVE");

    if (activeJob) {
      throw new Error("Chưa hoàn thành bệnh nhân hiện tại");
    }

    const nextJob = waitingJobs.find((j) => j.data.status === "WAITING");

    if (!nextJob) {
      throw new Error("Không còn bệnh nhân chờ");
    }

    // Gọi đến Queue để lấy job và chuyển status ACTIVE
    await nextJob.updateData({
      ...nextJob.data,
      status: "ACTIVE",
    });

    const job = await workerByDoctor(doctorId).getNextJob(workerToken);

    // Lấy vị trí job và số lượng job phía trước
    const orderedJobs = waitingJobs;
    const currentIndex = orderedJobs.findIndex((j) => j.id === nextJob.id);
    const jobsComplete = await queue.getCompleted();
    const currentNumber = jobsComplete.length + currentIndex + 1;

    // ===== Emit cho toàn bộ queue =====
    orderedJobs.forEach((job, index) => {
      const numberAhead = index - currentIndex;

      // skip job đã hoàn thành
      if (job.data.status === "COMPLETED") return;

      emitter.emitToUser(job.data.patientId, {
        currentNumber,
        yourNumber: index + 1,
        numberAhead: numberAhead > 0 ? numberAhead : 0,
        waitTime: numberAhead > 0 ? numberAhead * 15 : 0,
        status: job.data.status,
      });
    });

    // ===== Emit cho doctor =====
    const waitingCount = orderedJobs.filter(
      (j) => j.data.status === "WAITING",
    ).length;

    emitter.emitToDoctor(nextJob.data.doctorId, {
      currentNumber,
      yourNumber: currentNumber,
      numberAhead: waitingCount,
      waitTime: waitingCount * 15,
    });

    // ===== Emit cho patient đang khám =====
    emitter.emitToUser(nextJob.data.patientId, {
      currentNumber,
      yourNumber: currentNumber,
      numberAhead: 0,
      waitTime: 0,
      status: "ACTIVE",
    });

    await notificationService.sendAppointmentTurn({
      userId: nextJob.data.patientId,
      appointmentId: nextJob.data.appointmentId,
      doctorId: nextJob.data.doctorId,
    });

    return {
      id: nextJob.id,
      doctorId: nextJob.data.doctorId,
      patientId: nextJob.data.patientId,
      appointmentId: nextJob.data.appointmentId,
      status: "ACTIVE",
    };
  }

  /**
   * Xử lý hoàn thành khám cho bệnh nhân
   * @param {String} doctorId
   * @returns
   */
  async complete(doctorId, status) {
    const queue = getQueueByDoctor(doctorId);
    const activeJobs = await queue.getActive();

    // Lấy job active và chuyển sang complete
    const currentJob = activeJobs.find((j) => j.data.status === "ACTIVE");

    if (!currentJob) {
      throw new Error("Không có bệnh nhân đang khám");
    }

    await currentJob.updateData({
      ...currentJob.data,
      status, 
    });

    const job = activeJobs[0];
    if (!job) {
      throw new Error("Không có job");
    }
    await job.moveToCompleted("DONE", workerToken, false);

    const orderedJobs = activeJobs;
    const currentIndex = orderedJobs.findIndex((j) => j.id === currentJob.id);
    const jobsComplete = await queue.getCompleted();
    const currentNumber = jobsComplete.length + currentIndex + 1;

    // ===== Emit cho các bệnh nhân còn lại =====
    orderedJobs.forEach((job, index) => {
      if (job.data.status === "COMPLETED") return;

      const numberAhead = index - currentIndex - 1;

      emitter.emitToUser(job.data.patientId, {
        currentNumber,
        yourNumber: index + 1,
        numberAhead: numberAhead > 0 ? numberAhead : 0,
        waitTime: numberAhead > 0 ? numberAhead * 15 : 0,
        status: job.data.status,
      });
    });

    // ===== Emit cho doctor =====
    const waitingCount = orderedJobs.filter(
      (j) => j.data.status === "WAITING",
    ).length;

    emitter.emitToDoctor(currentJob.data.doctorId, {
      currentNumber,
      yourNumber: 0,
      numberAhead: waitingCount,
      waitTime: waitingCount * 15,
    });

    // ===== Emit cho bệnh nhân vừa khám xong =====
    emitter.emitToUser(currentJob.data.patientId, {
      currentNumber,
      yourNumber: -1,
      numberAhead: 0,
      waitTime: 0,
      status,
    });

    if (status === "NoShow") {
      await notificationService.sendAppointmentMissed({
        userId: currentJob.data.patientId,
        appointmentId: currentJob.data.appointmentId,
      });
    } else {
      await notificationService.sendAppointmentCompleted({
        userId: currentJob.data.patientId,
        appointmentId: currentJob.data.appointmentId,
      });
    }

    return {
      id: currentJob.id,
      doctorId: currentJob.data.doctorId,
      patientId: currentJob.data.patientId,
      appointmentId: currentJob.data.appointmentId,
      status,
    };
  }

  /**
   * Xử lý yêu cầu xem bệnh nhân hiện tại
   * @param {String} doctorId
   * @returns
   */
  async getCurrent(doctorId) {
    const queue = getQueueByDoctor(doctorId);

    const activeJobs = await queue.getActive();

    if (activeJobs.length === 0)
      throw new Error("Không có bệnh nhân đang khám");

    const job = activeJobs[0];

    return {
      id: job.id,
      doctorId: job.data.doctorId,
      patientId: job.data.patientId,
      status: "ACTIVE",
    };
  }

  /**
   * Xử lý việc thêm lịch khám mới vào queue
   * @param {String} doctorId
   * @param {String} patientId
   * @param {Int} appointmentId
   * @returns
   */
  async addJob({ doctorId, patientId, appointmentId }) {
    if (!doctorId || !patientId || !appointmentId) {
      console.log(`doctorId ${doctorId}`);
      console.log(`patientId ${patientId}`);
      console.log(`appointmentId ${appointmentId}`);

      throw new Error("Missing required fields");
    }

    const jobId = `appointment_${appointmentId}`;
    const queue = getQueueByDoctor(doctorId);

    return queue.add(
      "new_appointment",
      {
        doctorId,
        patientId,
        appointmentId,
        status: "WAITING",
      },
      { jobId, removeOnComplete: { age: 3600 } },
    );
  }

  /**
   * Xử lý yêu cầu xem hàng đợi của bệnh nhân
   * @param {String} doctorId
   * @param {Int} appointmentId
   * @returns
   */
  async getQueueStatus(doctorId, appointmentId) {
    const queue = getQueueByDoctor(doctorId);
    const jobId = `appointment_${appointmentId}`;

    const job = await queue.getJob(jobId);

    if (!job) {
      console.log(`Không tìm thấy Job với ID: ${appointmentId}`);
      throw new Error();
    }

    const data = job.data;
    const jobsWaiting = await queue.getWaiting();
    const jobsActive = await queue.getActive();
    const jobsComplete = await queue.getCompleted();

    const index = jobsWaiting.findIndex((j) => j.id === job.id);
    const currentNumber = jobsComplete.length + (jobsActive.length > 0 ? 1 : 0);

    // Case Completed
    if (data.status === "COMPLETED") {
      return {
        currentNumber,
        yourNumber: -1,
        numberAhead: 0,
        waitTime: 0,
        status: "COMPLETED",
      };
    }

    // Case Active
    if (data.status === "ACTIVE") {
      return {
        currentNumber,
        yourNumber: currentNumber,
        numberAhead: 0,
        waitTime: 0,
        status: "ACTIVE",
      };
    }

    // Case Waiting
    if (data.status === "WAITING") {
      const numberAhead = index + 1;

      return {
        currentNumber,
        yourNumber: currentNumber + index + 1,
        numberAhead,
        waitTime: numberAhead * 15,
        status: "WAITING",
      };
    }

    // fallback
    return {
      currentNumber: 0,
      yourNumber: 0,
      numberAhead: 0,
      waitTime: 0,
      status: "UNKNOWN",
    };
  }

  /**
   * Xử lý việc cancel
   * @param {String} doctorId 
   */
  async cancel(appointmentId, doctorId) {
    const queue = getQueueByDoctor(doctorId);
    const jobId = `appointment_${appointmentId}`;

    try {
      const job = await queue.getJob(jobId);

      if (!job) {
        console.warn(`Không tìm thấy Job với ID: ${appointmentId}`);
        throw new Error('Job not found');
      }

      const state = await job.getState();

      if (state === 'waiting') {
        await job.remove();
        console.log(`Đã remove job ${jobId}`);
      } else {
        console.warn(`Job ${jobId} không ở trạng thái waiting, state hiện tại: ${state}`);
      }

    } catch (error) {
      console.error('Lỗi khi cancel job', {
        appointmentId,
        doctorId,
        error: error.message,
      });

      throw error;
    }
  }
}

module.exports = new QueueManager();
