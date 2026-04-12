const queueManager = require("../queues/queueManager");

class QueueController {
  // Chuyển sang cuộc hẹn tiếp theo
  async next(req, res) {
    const { doctorId } = req.body;

    await queueManager.addJob("NEXT_PATIENT", { doctorId });

    return res.json({ message: "Next triggered" });
  }

  // Lấy trạng thái Queue hiện tại
  async getQueueStatus(req, res) {
    try {
      const { doctorId, userId } = req.query;

      const appointmentQueue = queueManager.queue; 

      const jobs = await appointmentQueue.getJobs(['active', 'waiting']);

      const doctorQueue = jobs
        .map(j => ({
          ...j.data,
          id: j.id,
          status: j.processedOn && !j.finishedOn ? 'InProgress' : 'Confirmed'
        }))
        .filter(q => q.doctorId === doctorId);

      const currentPatient = doctorQueue.find(q => q.status === 'InProgress');

      const currentNumber = currentPatient 
        ? doctorQueue.indexOf(currentPatient) + 1 
        : (doctorQueue.length > 0 ? 1 : 0);

      const userIndex = doctorQueue.findIndex(q => q.patientId === userId);
      const yourNumber = userIndex !== -1 ? userIndex + 1 : 0;

      const peopleAhead = (yourNumber > currentNumber) ? (yourNumber - currentNumber) : 0;

      return res.json({
        currentNumber,
        yourNumber,
        estimatedTime: peopleAhead * 15,
        totalInQueue: doctorQueue.length
      });

    } catch (error) {
      console.error("Queue Status Error:", error);
      res.status(500).json({ message: "Lỗi hệ thống hàng đợi" });
    }
  }
}

module.exports = new QueueController();
