const express = require('express');
const router = express.Router();
const appointmentService = require('../services/appointment.service');
const { successResponse, createdResponse, notFoundResponse, badRequestResponse, conflictResponse, errorResponse } = require('../utils/response.js');
const queueManager = require("../queues/queueManager.js")

// API: GET api/appointments/suggestions
router.get('/suggestions', async (req, res) => {
    try {
        const schedulerService = require('../services/smartScheduler.service');
        const result = await schedulerService.getSuggestions(req.query);
        return successResponse(res, result, 'Gợi ý slot khám');
    } catch (error) {
        return errorResponse(res, error.message || 'Lỗi khi lấy gợi ý', error.statusCode || 500);
    }
});

// API: POST api/appointments/
router.post('/', async (req, res) => {
    try {
        const { PatientId, DoctorId, StartTime, EndTime, AppointmentType, IsEmergency } = req.body;

        if (!PatientId || !DoctorId || !StartTime || !EndTime || !AppointmentType) {
            return badRequestResponse(res, 'Thiếu thông tin bắt buộc');
        }

        const appointment = await appointmentService.createAppointment({
            PatientId,
            DoctorId,
            StartTime,
            EndTime,
            AppointmentType,
            IsEmergency,
        });

        return createdResponse(res, appointment, 'Tạo lịch hẹn thành công');
    } catch (error) {
        if (error.statusCode === 409) {
            return conflictResponse(res, error.message);
        }
        return errorResponse(res, error.message || 'Lỗi khi tạo lịch hẹn', error.statusCode || 500);
    }
});

// API: GET api/appointments/
router.get('/', async (req, res) => {
    try {
        const { PatientId, DoctorId, Date, Status, page, limit } = req.query;
        const result = await appointmentService.getAppointments({
            PatientId, DoctorId, Date, Status, Page: page, Limit: limit,
        });
        return successResponse(res, result, 'Lấy danh sách thành công');
    } catch (error) {
        return errorResponse(res, error.message || 'Lỗi khi lấy danh sách', 500);
    }
});

// API: GET api/appointments/:id
router.get('/:id', async (req, res) => {
    try {
        const appointment = await appointmentService.getAppointmentById(req.params.id);
        if (!appointment) {
            return notFoundResponse(res, 'Không tìm thấy lịch hẹn');
        }
        return successResponse(res, appointment, 'Chi tiết lịch hẹn');
    } catch (error) {
        return errorResponse(res, error.message || 'Lỗi khi lấy chi tiết', 500);
    }
});

// API: Patch api/appointments/:id/cancel
router.patch('/:id/cancel', async (req, res) => {
    try {
        const { reason } = req.body;
        const appointment = await appointmentService.cancelAppointment(req.params.id, reason);

        return successResponse(res, appointment, 'Hủy lịch hẹn thành công');
    } catch (error) {
        if (error.statusCode === 404) {
            return notFoundResponse(res, error.message);
        }
        if (error.statusCode === 400) {
            return badRequestResponse(res, error.message);
        }
        return errorResponse(res, error.message || 'Lỗi khi hủy lịch hẹn', error.statusCode || 500);
    }
});

// API: Patch api/appointments/:id/status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status, actualStartTime, actualEndTime } = req.body;
        if (!status) {
            return badRequestResponse(res, 'Thiếu trạng thái');
        }
        const appointment = await appointmentService.updateAppointmentStatus(
            req.params.id, status, actualStartTime, actualEndTime
        );
        
        return successResponse(res, appointment, 'Cập nhật trạng thái thành công');
    } catch (error) {
        if (error.statusCode === 404) {
            return notFoundResponse(res, error.message);
        }
        if (error.statusCode === 400) {
            return badRequestResponse(res, error.message);
        }
        return errorResponse(res, error.message || 'Lỗi khi cập nhật trạng thái', error.statusCode || 500);
    }
});

// API: Patch api/appointments/:id/arrival
router.patch('/:id/arrival', async (req, res) => {
    try {
        const appointment = await appointmentService.confirmArrival(req.params.id);
        return successResponse(res, appointment, 'Xác nhận đến khám thành công');
    } catch (error) {
        if (error.statusCode === 404) {
            return notFoundResponse(res, error.message);
        }
        return errorResponse(res, error.message || 'Lỗi khi xác nhận', error.statusCode || 500);
    }
});

module.exports = router;