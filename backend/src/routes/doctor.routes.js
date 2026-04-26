const express = require('express');
const router = express.Router();
const { Doctor, User, WorkSchedule, sequelize } = require('../models/index.js');
const { successResponse, errorResponse } = require('../utils/response.js');

// GET /api/doctors - Get all doctors with their user info
router.get('/', async (req, res) => {
    try {
        const doctors = await sequelize.query(`
            SELECT 
                d.DoctorId,
                d.Specialty,
                d.DefaultBufferTime,
                u.Id as "user.Id",
                u.FullName as "user.FullName",
                u.Email as "user.Email",
                u.Phone as "user.Phone"
            FROM Doctors d
            LEFT JOIN Users u ON d.DoctorId = u.Id
            ORDER BY u.FullName ASC
        `, {
            type: sequelize.QueryTypes.SELECT,
            raw: false,
        });

        const result = doctors.map(doctor => ({
            DoctorId: doctor.DoctorId,
            Specialty: doctor.Specialty,
            DefaultBufferTime: doctor.DefaultBufferTime,
            user: doctor['user.FullName'] ? {
                Id: doctor['user.Id'],
                FullName: doctor['user.FullName'],
                Email: doctor['user.Email'],
                Phone: doctor['user.Phone'],
            } : null,
        }));

        return successResponse(res, result, 'Lấy danh sách bác sĩ thành công');
    } catch (error) {
        console.error('Error fetching doctors:', error);
        return errorResponse(res, error.message || 'Lỗi khi lấy danh sách bác sĩ', 500);
    }
});

// GET /api/doctors/:id - Get doctor by ID
router.get('/:id', async (req, res) => {
    try {
        const doctors = await sequelize.query(`
            SELECT 
                d.DoctorId,
                d.Specialty,
                d.DefaultBufferTime,
                u.Id as "user.Id",
                u.FullName as "user.FullName",
                u.Email as "user.Email",
                u.Phone as "user.Phone"
            FROM Doctors d
            LEFT JOIN Users u ON d.DoctorId = u.Id
            WHERE d.DoctorId = :doctorId
        `, {
            replacements: { doctorId: req.params.id },
            type: sequelize.QueryTypes.SELECT,
            raw: false,
        });

        if (!doctors.length) {
            return errorResponse(res, 'Không tìm thấy bác sĩ', 404);
        }

        const doctor = doctors[0];
        const result = {
            DoctorId: doctor.DoctorId,
            Specialty: doctor.Specialty,
            DefaultBufferTime: doctor.DefaultBufferTime,
            user: doctor['user.FullName'] ? {
                Id: doctor['user.Id'],
                FullName: doctor['user.FullName'],
                Email: doctor['user.Email'],
                Phone: doctor['user.Phone'],
            } : null,
        };

        return successResponse(res, result, 'Lấy thông tin bác sĩ thành công');
    } catch (error) {
        console.error('Error fetching doctor:', error);
        return errorResponse(res, error.message || 'Lỗi khi lấy thông tin bác sĩ', 500);
    }
});

// GET /api/doctors/:id/schedule - Get doctor's work schedule
router.get('/:id/schedule', async (req, res) => {
    try {
        const schedules = await WorkSchedule.findAll({
            where: { DoctorId: req.params.id, IsActive: true },
            order: [['DayOfWeek', 'ASC']],
        });

        const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
        
        const result = schedules.map(schedule => ({
            ScheduleId: schedule.ScheduleId,
            DayOfWeek: schedule.DayOfWeek,
            DayName: dayNames[schedule.DayOfWeek] || `Ngày ${schedule.DayOfWeek}`,
            StartTime: schedule.StartTime,
            EndTime: schedule.EndTime,
            IsActive: schedule.IsActive,
        }));

        return successResponse(res, result, 'Lấy lịch làm việc thành công');
    } catch (error) {
        console.error('Error fetching schedule:', error);
        return errorResponse(res, error.message || 'Lỗi khi lấy lịch làm việc', 500);
    }
});

module.exports = router;
