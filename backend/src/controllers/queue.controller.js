const queueManager = require("../queues/queueManager");

class QueueController {
  async next(req, res) {
    try {
      const job = await queueManager.getNext();

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
    try {
      const job = await queueManager.complete();

      return res.json({
        message: "Đã hoàn tất khám",
        data: job,
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  async current(req, res) {
    try {
      const job = await queueManager.getCurrent();

      return res.json({
        data: job,
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  async add(req, res) {
    const { doctorId, patientId, appointmentId } = req.body;

    const job = await queueManager.addJob(doctorId, patientId, appointmentId);

    res.json({
      message: "Added",
      jobId: job.id,
    });
  }
}

module.exports = new QueueController();
