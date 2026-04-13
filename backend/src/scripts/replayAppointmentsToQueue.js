const { Appointment } = require("../models");
const queueManager = require("../queues/queueManager");

async function replayAppointments() {
  try {
    console.log("Replaying appointments to queue...");

    // Lấy các appointment cần đưa vào queue
    const appointments = await Appointment.findAll({
      where: {
        Status: ["Confirmed"],
      },
    });

    console.log(`Found ${appointments.length} confirmed appointments`);

    for (const appt of appointments) {
      await queueManager.addJob({
        doctorId: appt.DoctorId,
        patientId: appt.PatientId,
        appointmentId: appt.AppointmentId,
      });
    }

    console.log("Replay completed");
  } catch (error) {
    console.error("Replay failed:", error);
  }
}

replayAppointments();

// module.exports = { replayAppointments };
