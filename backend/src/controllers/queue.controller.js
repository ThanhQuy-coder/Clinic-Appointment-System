const queueManager = require("../queues/queueManager");

class QueueController {
  // Chuyển sang cuộc hẹn tiếp theo
  async next(req, res) {
    const { doctorId } = req.body;

    await queueManager.addJob("NEXT_PATIENT", { doctorId });

    return res.json({ message: "Next triggered" });
  }
}

module.exports = new QueueController();
