const { Appointment, Op } = require('../models/index.js');
const { Sequelize } = require('sequelize');

const MIN_SAMPLES = 3;

const DEFAULT_DURATIONS = {
    'Regular': 15,
    'FollowUp': 20,
    'Emergency': 30,
    'Checkup': 15,
    'Consultation': 20,
    'default': 15,
};

const calculateDurationMinutes = (actualStart, actualEnd) => {
    if (!actualStart || !actualEnd) return null;
    const diff = new Date(actualEnd) - new Date(actualStart);
    return Math.round(diff / 60000);
};

const getEstimatedDuration = async (doctorId, appointmentType) => {
    if (doctorId) {
        const doctorTypeAvg = await Appointment.findAll({
            attributes: [
                [Sequelize.fn('AVG', Sequelize.literal('TIMESTAMPDIFF(MINUTE, ActualStartTime, ActualEndTime)')), 'avgDuration'],
                [Sequelize.fn('COUNT', '*'), 'count'],
            ],
            where: {
                DoctorId: doctorId,
                AppointmentType: appointmentType,
                ActualStartTime: { [Op.ne]: null },
                ActualEndTime: { [Op.ne]: null },
            },
            raw: true,
        });

        if (doctorTypeAvg[0]?.count >= MIN_SAMPLES && doctorTypeAvg[0]?.avgDuration) {
            return Math.round(parseFloat(doctorTypeAvg[0].avgDuration));
        }
    }

    if (appointmentType) {
        const typeAvg = await Appointment.findAll({
            attributes: [
                [Sequelize.fn('AVG', Sequelize.literal('TIMESTAMPDIFF(MINUTE, ActualStartTime, ActualEndTime)')), 'avgDuration'],
                [Sequelize.fn('COUNT', '*'), 'count'],
            ],
            where: {
                AppointmentType: appointmentType,
                ActualStartTime: { [Op.ne]: null },
                ActualEndTime: { [Op.ne]: null },
            },
            raw: true,
        });

        if (typeAvg[0]?.count >= MIN_SAMPLES && typeAvg[0]?.avgDuration) {
            return Math.round(parseFloat(typeAvg[0].avgDuration));
        }
    }

    return DEFAULT_DURATIONS[appointmentType] || DEFAULT_DURATIONS['default'];
};

const getDefaultDurations = () => ({ ...DEFAULT_DURATIONS });

const refreshDurationCache = async () => {};

module.exports = {
    getEstimatedDuration,
    getDefaultDurations,
    calculateDurationMinutes,
    MIN_SAMPLES,
};