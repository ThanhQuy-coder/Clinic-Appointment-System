const { Doctor, WorkSchedule, DoctorLeave, Appointment, Patient, sequelize } = require('../models/index.js');
const { Op } = require('sequelize');
const { getEstimatedDuration } = require('./durationEstimator.service');

const SLOT_OCCUPYING_STATUSES = ['Pending', 'Confirmed', 'InProgress'];

const SCORE_WEIGHTS = {
    queueDepth: 30,
    doctorLoad: 20,
    estimatedWait: 10,
    reliabilityBonus: 15,
    emergencyBonus: 50,
};

const SLOT_GRID_MINUTES = 10;
const DEFAULT_LIMIT = 5;

const isSlotOccupied = (slotStart, slotEnd, appointments) => {
    return appointments.some(appt => {
        const apptStart = new Date(appt.StartTime);
        const apptEnd = new Date(appt.EndTime);
        return slotStart < apptEnd && slotEnd > apptStart;
    });
};

const isSlotOnLeave = (slotStart, slotEnd, leaves) => {
    return leaves.some(leave => {
        const leaveStart = new Date(leave.StartTime);
        const leaveEnd = new Date(leave.EndTime);
        return slotStart < leaveEnd && slotEnd > leaveStart;
    });
};

const calculateWaitTime = async (doctorId, slotStart) => {
    const dayStart = new Date(slotStart);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(slotStart);
    dayEnd.setHours(23, 59, 59, 999);

    const appointments = await Appointment.findAll({
        where: {
            DoctorId: doctorId,
            StartTime: { [Op.between]: [dayStart, dayEnd] },
            Status: { [Op.in]: SLOT_OCCUPYING_STATUSES },
            StartTime: { [Op.lt]: slotStart },
        },
        order: [['StartTime', 'ASC']],
    });

    let waitMinutes = 0;
    for (const appt of appointments) {
        const duration = await getEstimatedDuration(doctorId, appt.AppointmentType);
        waitMinutes += duration;
    }

    return waitMinutes;
};

const calculateDoctorLoad = async (doctorId, date, estimatedDuration) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const schedules = await WorkSchedule.findAll({
        where: { DoctorId: doctorId, IsActive: true },
    });

    if (!schedules.length) return 100;

    const schedule = schedules.find(s => String(s.DayOfWeek) === String(date.getDay()));
    if (!schedule) return 100;

    const workStart = new Date(schedule.StartTime);
    const workEnd = new Date(schedule.EndTime);
    const totalMinutes = (workEnd - workStart) / 60000;

    if (totalMinutes <= 0) return 100;

    const count = await Appointment.count({
        where: {
            DoctorId: doctorId,
            StartTime: { [Op.between]: [dayStart, dayEnd] },
            Status: { [Op.in]: SLOT_OCCUPYING_STATUSES },
        },
    });

    const bookedMinutes = (count + 1) * estimatedDuration;
    const loadPercent = Math.min(100, (bookedMinutes / totalMinutes) * 100);
    return Math.round(loadPercent);
};

const getReliabilityBonus = async (patientId) => {
    if (!patientId) return 0;

    const patient = await Patient.findByPk(patientId);
    if (!patient || patient.ReliabilityScore === undefined) return 0;

    return (patient.ReliabilityScore / 100) * SCORE_WEIGHTS.reliabilityBonus;
};

const generateCandidateSlots = async (doctorId, date, appointmentType) => {
    const candidates = [];
    const dayOfWeek = String(date.getDay());

    const schedules = await WorkSchedule.findAll({
        where: {
            DoctorId: doctorId,
            DayOfWeek: dayOfWeek,
            IsActive: true,
        },
    });

    if (!schedules.length) return [];

    const schedule = schedules[0];
    const workStart = new Date(schedule.StartTime);
    const workEnd = new Date(schedule.EndTime);

    const startHour = workStart.getHours();
    const startMinute = workStart.getMinutes();
    const endHour = workEnd.getHours();
    const endMinute = workEnd.getMinutes();

    const slotDate = new Date(date);
    slotDate.setHours(startHour, startMinute, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(endHour, endMinute, 0, 0);

    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const existingAppointments = await Appointment.findAll({
        where: {
            DoctorId: doctorId,
            StartTime: { [Op.between]: [dayStart, dayEnd] },
            Status: { [Op.in]: SLOT_OCCUPYING_STATUSES },
        },
    });

    const leaves = await DoctorLeave.findAll({
        where: {
            DoctorId: doctorId,
            Status: 'Approved',
        },
    });

    const estimatedDuration = await getEstimatedDuration(doctorId, appointmentType);

    let currentSlot = new Date(slotDate);
    while (currentSlot < endDate) {
        const slotEnd = new Date(currentSlot.getTime() + estimatedDuration * 60000);

        if (slotEnd > endDate) break;

        if (!isSlotOccupied(currentSlot, slotEnd, existingAppointments)) {
            if (!isSlotOnLeave(currentSlot, slotEnd, leaves)) {
                candidates.push({
                    startTime: new Date(currentSlot),
                    endTime: new Date(slotEnd),
                    estimatedDuration,
                });
            }
        }

        currentSlot = new Date(currentSlot.getTime() + SLOT_GRID_MINUTES * 60000);
    }

    return candidates;
};

const calculateSlotScore = async (slot, doctorId, date, patientId, isEmergency = false) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);

    const queueDepth = await Appointment.count({
        where: {
            DoctorId: doctorId,
            StartTime: { [Op.between]: [dayStart, slot.startTime] },
            Status: { [Op.in]: SLOT_OCCUPYING_STATUSES },
        },
    });

    const estimatedWait = await calculateWaitTime(doctorId, slot.startTime);
    const doctorLoad = await calculateDoctorLoad(doctorId, date, slot.estimatedDuration);
    const reliabilityBonus = await getReliabilityBonus(patientId);

    let score =
        SCORE_WEIGHTS.queueDepth * queueDepth +
        SCORE_WEIGHTS.doctorLoad * (doctorLoad / 100) +
        SCORE_WEIGHTS.estimatedWait * (estimatedWait / 30) -
        reliabilityBonus;

    if (isEmergency) {
        score -= SCORE_WEIGHTS.emergencyBonus;
    }

    return {
        score,
        queueDepth,
        estimatedWait,
        doctorLoad,
        reliabilityBonus,
    };
};

const getActiveDoctors = async () => {
    const { User } = require('../models/index.js');

    const doctors = await Doctor.findAll({ raw: false });

    const doctorsWithNames = await Promise.all(doctors.map(async (doctor) => {
        const user = await User.findByPk(doctor.DoctorId);
        return {
            ...doctor.toJSON(),
            userName: user?.FullName || 'Bác sĩ',
        };
    }));

    return doctorsWithNames;
};

const getDoctorInfo = async (doctorId) => {
    const { User } = require('../models/index.js');

    const doctor = await Doctor.findByPk(doctorId, { raw: false });
    if (!doctor) return null;

    const user = await User.findByPk(doctorId);
    return {
        ...doctor.toJSON(),
        userName: user?.FullName || 'Bác sĩ',
    };
};

const getSuggestions = async (params) => {
    const { date, appointmentType = 'Regular', doctorId, limit = DEFAULT_LIMIT, patientId } = params;

    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    let doctors = [];
    if (doctorId) {
        const doctor = await getDoctorInfo(doctorId);
        if (doctor) doctors = [doctor];
    } else {
        doctors = await getActiveDoctors();
    }

    if (!doctors.length) {
        return {
            suggestions: [],
            message: 'Không có bác sĩ khả dụng',
        };
    }

    const allCandidates = [];

    for (const doctor of doctors) {
        const slots = await generateCandidateSlots(doctor.DoctorId, targetDate, appointmentType);

        for (const slot of slots) {
            const scoreData = await calculateSlotScore(
                slot,
                doctor.DoctorId,
                targetDate,
                patientId,
                false
            );

            allCandidates.push({
                doctorId: doctor.DoctorId,
                doctorName: doctor.userName || 'Bác sĩ',
                specialty: doctor.Specialty,
                startTime: slot.startTime,
                endTime: slot.endTime,
                estimatedDuration: slot.estimatedDuration,
                estimatedWaitMinutes: scoreData.estimatedWait,
                queueDepth: scoreData.queueDepth,
                doctorLoadPercent: scoreData.doctorLoad,
                score: scoreData.score,
                scoreBreakdown: {
                    queueDepth: scoreData.queueDepth,
                    doctorLoad: scoreData.doctorLoad,
                    estimatedWait: scoreData.estimatedWait,
                    reliabilityBonus: scoreData.reliabilityBonus,
                },
            });
        }
    }

    allCandidates.sort((a, b) => a.score - b.score);

    const suggestions = allCandidates.slice(0, parseInt(limit));

    return {
        date: targetDate.toISOString().split('T')[0],
        appointmentType,
        totalCandidates: allCandidates.length,
        suggestions,
    };
};

const invalidateCache = (date, doctorId) => {};

module.exports = {
    getSuggestions,
    getActiveDoctors,
    generateCandidateSlots,
    calculateSlotScore,
    calculateWaitTime,
    calculateDoctorLoad,
    invalidateCache,
    SCORE_WEIGHTS,
    SLOT_GRID_MINUTES,
    DEFAULT_LIMIT,
};