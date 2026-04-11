const { Appointment, Doctor, WorkSchedule, DoctorLeave, Patient, sequelize } = require('../models/index.js');
const { Op, Transaction } = require('sequelize');

const SLOT_OCCUPYING_STATUSES = ['Pending', 'Confirmed', 'InProgress'];

const isOverlapping = (startA, endA, startB, endB) => {
    return startA < endB && startB < endA;
};

const getDayAppointments = async (doctorId, date, transaction) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return Appointment.findAll({
        where: {
            DoctorId: doctorId,
            StartTime: { [Op.between]: [dayStart, dayEnd] },
            Status: { [Op.in]: SLOT_OCCUPYING_STATUSES },
        },
        transaction,
        lock: transaction ? Transaction.LOCK.UPDATE : false,
    });
};

const isWithinWorkSchedule = async (doctorId, startTime, endTime) => {
    const dayOfWeek = String(startTime.getDay());
    const schedules = await WorkSchedule.findAll({
        where: {
            DoctorId: doctorId,
            DayOfWeek: dayOfWeek,
            IsActive: true,
        },
    });

    if (!schedules.length) return false;

    const workscheduleStart = new Date(schedules[0].StartTime);
    const workscheduleEnd = new Date(schedules[0].EndTime);

    const scheduleStart = new Date(startTime);
    scheduleStart.setHours(workscheduleStart.getHours(), workscheduleStart.getMinutes(), 0, 0);

    const scheduleEnd = new Date(startTime);
    scheduleEnd.setHours(workscheduleEnd.getHours(), workscheduleEnd.getMinutes(), 0, 0);

    return startTime >= scheduleStart && endTime <= scheduleEnd;
};

const isOnLeave = async (doctorId, startTime, endTime) => {
    const leaves = await DoctorLeave.findAll({
        where: {
            DoctorId: doctorId,
            Status: 'Approved',
        },
    });

    return leaves.some(leave => {
        const leaveStart = new Date(leave.StartTime);
        const leaveEnd = new Date(leave.EndTime);
        return startTime < leaveEnd && endTime > leaveStart;
    });
};

const createAppointment = async (data) => {
    const { PatientId, DoctorId, StartTime, EndTime, AppointmentType, IsEmergency = false } = data;

    return sequelize.transaction(async (transaction) => {
        const dayStart = new Date(StartTime);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(StartTime);
        dayEnd.setHours(23, 59, 59, 999);

        const existingAppointments = await Appointment.findAll({
            where: {
                DoctorId,
                StartTime: { [Op.between]: [dayStart, dayEnd] },
                Status: { [Op.in]: SLOT_OCCUPYING_STATUSES },
            },
            transaction,
            lock: Transaction.LOCK.UPDATE,
        });

        const hasConflict = existingAppointments.some(appt =>
            isOverlapping(new Date(appt.StartTime), new Date(appt.EndTime), new Date(StartTime), new Date(EndTime))
        );

        if (hasConflict) {
            const error = new Error('Slot này đã được đặt. Vui lòng chọn thời gian khác.');
            error.statusCode = 409;
            throw error;
        }

        if (!IsEmergency) {
            const inSchedule = await isWithinWorkSchedule(DoctorId, new Date(StartTime), new Date(EndTime));
            if (!inSchedule) {
                const error = new Error('Thời gian này bác sĩ không làm việc.');
                error.statusCode = 400;
                throw error;
            }

            const onLeave = await isOnLeave(DoctorId, new Date(StartTime), new Date(EndTime));
            if (onLeave) {
                const error = new Error('Bác sĩ đang trong thời gian nghỉ phép.');
                error.statusCode = 400;
                throw error;
            }
        }

        const appointment = await Appointment.create({
            PatientId,
            DoctorId,
            StartTime: new Date(StartTime),
            EndTime: new Date(EndTime),
            AppointmentType,
            Status: 'Pending',
            IsEmergency,
        }, { transaction });

        return appointment;
    });
};

const getAppointments = async (filters) => {
    const { PatientId, DoctorId, Date, Status, Page = 1, Limit = 20 } = filters;
    const where = {};

    if (PatientId) where.PatientId = PatientId;
    if (DoctorId) where.DoctorId = DoctorId;
    if (Status) where.Status = Status;
    if (Date) {
        const dayStart = new Date(Date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(Date);
        dayEnd.setHours(23, 59, 59, 999);
        where.StartTime = { [Op.between]: [dayStart, dayEnd] };
    }

    const { count, rows } = await Appointment.findAndCountAll({
        where,
        include: [
            { model: Doctor, as: 'doctor', attributes: ['DoctorId', 'Specialty'] },
        ],
        order: [['StartTime', 'ASC']],
        limit: parseInt(Limit),
        offset: (parseInt(Page) - 1) * parseInt(Limit),
    });

    return {
        appointments: rows,
        total: count,
        page: parseInt(Page),
        totalPages: Math.ceil(count / parseInt(Limit)),
    };
};

const getAppointmentById = async (appointmentId) => {
    return Appointment.findByPk(appointmentId, {
        include: [
            { model: Doctor, as: 'doctor' },
            { model: Patient, as: 'patient' },
        ],
    });
};

const cancelAppointment = async (appointmentId, reason) => {
    return sequelize.transaction(async (transaction) => {
        const appointment = await Appointment.findByPk(appointmentId, { transaction });
        if (!appointment) {
            const error = new Error('Appointment not found');
            error.statusCode = 404;
            throw error;
        }

        if (['Cancelled', 'NoShow', 'Completed'].includes(appointment.Status)) {
            const error = new Error('Không thể hủy appointment đã ở trạng thái: ' + appointment.Status);
            error.statusCode = 400;
            throw error;
        }

        await appointment.update({
            Status: 'Cancelled',
            CancelledAt: new Date(),
            CancelReason: reason || null,
        }, { transaction });

        return appointment;
    });
};

const updateAppointmentStatus = async (appointmentId, status, actualStartTime = null, actualEndTime = null) => {
    const validStatuses = ['Pending', 'Confirmed', 'InProgress', 'Completed', 'Cancelled', 'NoShow'];
    if (!validStatuses.includes(status)) {
        const error = new Error('Trạng thái không hợp lệ');
        error.statusCode = 400;
        throw error;
    }

    return sequelize.transaction(async (transaction) => {
        const appointment = await Appointment.findByPk(appointmentId, { transaction });
        if (!appointment) {
            const error = new Error('Appointment not found');
            error.statusCode = 404;
            throw error;
        }

        const updateData = { Status: status };
        if (actualStartTime) updateData.ActualStartTime = new Date(actualStartTime);
        if (actualEndTime) updateData.ActualEndTime = new Date(actualEndTime);

        await appointment.update(updateData, { transaction });
        return appointment;
    });
};

const confirmArrival = async (appointmentId) => {
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

const getDayQueue = async (doctorId, date) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return Appointment.findAll({
        where: {
            DoctorId: doctorId,
            StartTime: { [Op.between]: [dayStart, dayEnd] },
            Status: { [Op.in]: SLOT_OCCUPYING_STATUSES },
        },
        order: [['StartTime', 'ASC']],
    });
};

module.exports = {
    createAppointment,
    getAppointments,
    getAppointmentById,
    cancelAppointment,
    updateAppointmentStatus,
    confirmArrival,
    getDayQueue,
    getDayAppointments,
};