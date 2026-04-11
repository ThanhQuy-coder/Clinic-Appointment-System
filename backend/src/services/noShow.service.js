const { Appointment, Patient, sequelize } = require('../models/index.js');
const { Op } = require('sequelize');

const NO_SHOW_CHECK_STATUSES = ['Pending', 'Confirmed'];
const NO_SHOW_GRACE_PERIOD_MINUTES = parseInt(process.env.NO_SHOW_GRACE_PERIOD || '15');
const NO_SHOW_PENALTY = parseInt(process.env.NO_SHOW_PENALTY || '10');

const processNoShow = async (appointment, transaction) => {
    const now = new Date();
    const startTime = new Date(appointment.StartTime);
    const gracePeriodEnd = new Date(startTime.getTime() + NO_SHOW_GRACE_PERIOD_MINUTES * 60000);

    if (now >= gracePeriodEnd && !appointment.ActualStartTime) {
        await appointment.update({
            Status: 'NoShow',
        }, { transaction });

        const patient = await Patient.findByPk(appointment.PatientId, { transaction });
        if (patient) {
            const newScore = Math.max(0, (patient.ReliabilityScore || 100) - NO_SHOW_PENALTY);
            await patient.update({
                NoShowCount: (patient.NoShowCount || 0) + 1,
                ReliabilityScore: newScore,
            }, { transaction });
        }

        return true;
    }

    return false;
};

const runNoShowJob = async () => {
    console.log('[NoShowJob] Bắt đầu kiểm tra no-show...');

    const now = new Date();
    const graceThreshold = new Date(now.getTime() - NO_SHOW_GRACE_PERIOD_MINUTES * 60000);

    const appointmentsToCheck = await Appointment.findAll({
        where: {
            Status: { [Op.in]: NO_SHOW_CHECK_STATUSES },
            StartTime: { [Op.lt]: graceThreshold },
            ActualStartTime: { [Op.is]: null },
        },
    });

    console.log(`[NoShowJob] Tìm thấy ${appointmentsToCheck.length} appointment cần kiểm tra`);

    let noShowCount = 0;

    await sequelize.transaction(async (transaction) => {
        for (const appointment of appointmentsToCheck) {
            const processed = await processNoShow(appointment, transaction);
            if (processed) {
                noShowCount++;
                console.log(`[NoShowJob] Đánh dấu no-show: Appointment #${appointment.AppointmentId}`);
            }
        }
    });

    console.log(`[NoShowJob] Hoàn thành. Đã xử lý ${noShowCount} no-show.`);
    return {
        checked: appointmentsToCheck.length,
        noShows: noShowCount,
    };
};

const recalculateReliability = async (patientId) => {
    const patient = await Patient.findByPk(patientId);
    if (!patient) return null;

    const allAppointments = await Appointment.findAll({
        where: { PatientId: patientId },
    });

    const totalCount = allAppointments.length;
    const noShowCount = allAppointments.filter(a => a.Status === 'NoShow').length;
    const completedCount = allAppointments.filter(a => a.Status === 'Completed').length;

    let score = 100;
    score -= noShowCount * NO_SHOW_PENALTY;
    score += completedCount * 5;
    score = Math.min(100, Math.max(0, score));

    await patient.update({ ReliabilityScore: score });

    return {
        patientId,
        totalAppointments: totalCount,
        noShows: noShowCount,
        completed: completedCount,
        newScore: score,
    };
};

const getPatientReliability = async (patientId) => {
    const patient = await Patient.findByPk(patientId);
    if (!patient) return null;

    const appointments = await Appointment.findAll({
        where: { PatientId: patientId },
    });

    return {
        patientId,
        reliabilityScore: patient.ReliabilityScore,
        noShowCount: patient.NoShowCount,
        totalAppointments: appointments.length,
        completedAppointments: appointments.filter(a => a.Status === 'Completed').length,
    };
};

const markPatientArrival = async (appointmentId) => {
    return sequelize.transaction(async (transaction) => {
        const appointment = await Appointment.findByPk(appointmentId, { transaction });
        if (!appointment) {
            const error = new Error('Appointment not found');
            error.statusCode = 404;
            throw error;
        }

        await appointment.update({
            Status: 'InProgress',
            ActualStartTime: new Date(),
        }, { transaction });

        return appointment;
    });
};

module.exports = {
    runNoShowJob,
    processNoShow,
    recalculateReliability,
    getPatientReliability,
    markPatientArrival,
    NO_SHOW_GRACE_PERIOD_MINUTES,
    NO_SHOW_PENALTY,
    NO_SHOW_CHECK_STATUSES,
};