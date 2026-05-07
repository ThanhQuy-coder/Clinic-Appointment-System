const queueManager = require("../queues/queueManager");

class QueueController {
  async next(req, res) {
    const { doctorId } = req.query;

    try {
      const job = await queueManager.getNext(doctorId);

      if (!job) {
        return res.json({ message: "Hàng đợi trống" });
      }

      return res.json({
        message: "Đang khám bệnh nhân",
        data: job,
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  async complete(req, res) {
    const { doctorId, status = "Completed" } = req.query;
    if (!doctorId) {
      return res.status(400).json({message: "Thiếu doctorId"});
    }

    try {
      const job = await queueManager.complete(doctorId, status);

      return res.json({
        message: "Đã hoàn tất khám",
        data: job,
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  async current(req, res) {
    const { doctorId } = req.query;
    if (!doctorId) {
      return res.status(400).json({ message: "Thiếu doctorId" });
    }

    try {
      const job = await queueManager.getCurrent(doctorId);

      return res.json({
        data: job,
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  async add(req, res) {
    const { doctorId, patientId, appointmentId } = req.body;

    const job = await queueManager.addJob({ doctorId, patientId, appointmentId });

    res.json({
      message: "Added",
      jobId: job.id,
    });
  }

  async queueStatus(req, res) {
    const { doctorId, appointmentId } = req.query;

    try {
      const job = await queueManager.getQueueStatus(doctorId, appointmentId);

      return res.json({
        currentNumber: job.currentNumber,
        yourNumber: job.yourNumber,
        numberAhead: job.numberAhead,
        waitTime: job.waitTime,
        status: job.status,
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
}

module.exports = new QueueController();
