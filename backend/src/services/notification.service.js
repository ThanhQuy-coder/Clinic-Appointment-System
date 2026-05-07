const notificationQueue = require("../queues/notificationQueue");

const NOTIFICATION_TYPES = {
  APPOINTMENT_CREATED: "APPOINTMENT_CREATED",
  APPOINTMENT_REMINDER: "APPOINTMENT_REMINDER",
  APPOINTMENT_TURN: "APPOINTMENT_TURN",
  APPOINTMENT_COMPLETED: "APPOINTMENT_COMPLETED",
  APPOINTMENT_CANCELLED: "APPOINTMENT_CANCELLED",
  APPOINTMENT_MISSED: "APPOINTMENT_MISSED",
};

const formatDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("vi-VN", {
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const buildPayload = (type, data = {}) => {
  const doctorText = data.doctorName || data.doctorId || "bác sĩ";
  const appointmentText = data.appointmentId ? `#${data.appointmentId}` : "";
  const startTimeText = formatDateTime(data.startTime);
  const minutesText = data.minutes ? `${data.minutes} phút` : "";

  switch (type) {
    case NOTIFICATION_TYPES.APPOINTMENT_CREATED:
      return {
        title: "Đặt lịch thành công",
        message: `Bạn đã đặt lịch khám ${appointmentText} với ${doctorText}${startTimeText ? ` lúc ${startTimeText}` : ""}.`,
      };
    case NOTIFICATION_TYPES.APPOINTMENT_REMINDER:
      return {
        title: "Nhắc lịch khám",
        message: `Bạn có lịch khám ${appointmentText} với ${doctorText} sau ${minutesText}.`,
      };
    case NOTIFICATION_TYPES.APPOINTMENT_TURN:
      return {
        title: "Đến lượt khám",
        message: `Đến lượt bạn khám ${appointmentText} với ${doctorText}.`,
      };
    case NOTIFICATION_TYPES.APPOINTMENT_COMPLETED:
      return {
        title: "Hoàn thành khám",
        message: `Bạn đã hoàn thành buổi khám ${appointmentText}.`,
      };
    case NOTIFICATION_TYPES.APPOINTMENT_MISSED:
      return {
        title: "Bỏ lỡ lượt khám",
        message: `Bạn đã bỏ lỡ lượt khám ${appointmentText}.`,
      };
    case NOTIFICATION_TYPES.APPOINTMENT_CANCELLED:
      return {
        title: "Lịch khám đã bị hủy",
        message: `Lịch khám ${appointmentText} của bạn đã bị hủy.`,
      };
    default:
      return {
        title: "Thông báo hệ thống",
        message: data.message || "Bạn có thông báo mới.",
      };
  }
};

const enqueue = async ({ userId, type, data = {}, options = {} }) => {
  if (!userId || !type) return null;

  const payload = buildPayload(type, data);
  const jobName = type === NOTIFICATION_TYPES.APPOINTMENT_REMINDER ? "reminder" : "notify";

  return notificationQueue.add(
    jobName,
    {
      type,
      userId,
      title: payload.title,
      message: payload.message,
      meta: data,
      sendingTime: new Date().toISOString(),
    },
    options,
  );
};

const sendAppointmentCreated = async ({ userId, appointmentId, doctorId, doctorName, startTime }) => {
  return enqueue({
    userId,
    type: NOTIFICATION_TYPES.APPOINTMENT_CREATED,
    data: { appointmentId, doctorId, doctorName, startTime },
  });
};

const sendAppointmentTurn = async ({ userId, appointmentId, doctorId, doctorName }) => {
  return enqueue({
    userId,
    type: NOTIFICATION_TYPES.APPOINTMENT_TURN,
    data: { appointmentId, doctorId, doctorName },
  });
};

const sendAppointmentCompleted = async ({ userId, appointmentId }) => {
  return enqueue({
    userId,
    type: NOTIFICATION_TYPES.APPOINTMENT_COMPLETED,
    data: { appointmentId },
  });
};

const sendAppointmentMissed = async ({ userId, appointmentId }) => {
  return enqueue({
    userId,
    type: NOTIFICATION_TYPES.APPOINTMENT_MISSED,
    data: { appointmentId },
  });
};

const sendAppointmentCancelled = async ({ userId, appointmentId }) => {
  return enqueue({
    userId,
    type: NOTIFICATION_TYPES.APPOINTMENT_CANCELLED,
    data: { appointmentId },
  });
};

const scheduleAppointmentReminders = async ({
  userId,
  appointmentId,
  doctorId,
  doctorName,
  startTime,
}) => {
  if (!startTime) return [];

  const remindersInMinutes = [24 * 60, 60, 15];
  const startMs = new Date(startTime).getTime();
  if (Number.isNaN(startMs)) return [];

  const jobs = [];
  const now = Date.now();

  for (const minutes of remindersInMinutes) {
    const delay = startMs - now - minutes * 60 * 1000;
    if (delay <= 0) continue;

    const job = await enqueue({
      userId,
      type: NOTIFICATION_TYPES.APPOINTMENT_REMINDER,
      data: { appointmentId, doctorId, doctorName, startTime, minutes },
      options: {
        delay,
        jobId: `reminder_${appointmentId}_${minutes}`,
      },
    });
    jobs.push(job);
  }

  return jobs;
};

module.exports = {
  NOTIFICATION_TYPES,
  enqueue,
  sendAppointmentCreated,
  scheduleAppointmentReminders,
  sendAppointmentTurn,
  sendAppointmentCompleted,
  sendAppointmentMissed,
  sendAppointmentCancelled,
};
