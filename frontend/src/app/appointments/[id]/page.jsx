'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import axios from '@/lib/axios';

const statusLabels = {
  Pending: { text: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
  Confirmed: { text: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
  InProgress: { text: 'Đang khám', color: 'bg-green-100 text-green-800' },
  Completed: { text: 'Hoàn thành', color: 'bg-gray-100 text-gray-800' },
  Cancelled: { text: 'Đã hủy', color: 'bg-red-100 text-red-800' },
  NoShow: { text: 'Không đến', color: 'bg-orange-100 text-orange-800' },
};

export default function AppointmentDetailPage() {
  const params = useParams();
  const id = params.id;

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAppointment();
    }
  }, [id]);

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/appointments/${id}`);
      setAppointment(res.data.data);
    } catch (err) {
      setError('Không thể tải thông tin lịch hẹn');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCancel = async () => {
    if (!confirm('Bạn có chắc muốn hủy lịch hẹn này?')) return;

    try {
      setActionLoading(true);
      await axios.patch(`/appointments/${id}/cancel`);
      alert('Đã hủy lịch hẹn');
      fetchAppointment();
    } catch (err) {
      alert(err.response?.data?.message || 'Hủy lịch thất bại');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badge = statusLabels[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const canCancel = appointment && ['Pending'].includes(appointment.Status);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error || 'Không tìm thấy lịch hẹn'}
        </div>
        <Link href="/appointments" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/appointments" className="text-blue-600 hover:underline">
          ← Quay lại danh sách
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-[#0e6add] text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold mb-1">Chi tiết lịch hẹn</h1>
              <p className="text-sm opacity-80">Mã: {appointment.AppointmentId}</p>
            </div>
            {getStatusBadge(appointment.Status)}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Date & Time */}
          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-2">Ngày & Giờ</h2>
            <p className="text-lg font-medium">{formatDate(appointment.StartTime)}</p>
            <p className="text-gray-600">
              {formatTime(appointment.StartTime)} - {formatTime(appointment.EndTime)}
            </p>
          </div>

          {/* Doctor */}
          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-2">Bác sĩ</h2>
            <p className="font-medium">
              {appointment.Doctor?.user?.FullName || appointment.DoctorId || '-'}
            </p>
            {appointment.Doctor?.Specialty && (
              <p className="text-sm text-gray-500">{appointment.Doctor.Specialty}</p>
            )}
          </div>

          {/* Patient */}
          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-2">Bệnh nhân</h2>
            <p className="font-medium">
              {appointment.Patient?.user?.FullName || appointment.PatientId || '-'}
            </p>
            {appointment.Patient?.user?.Phone && (
              <p className="text-sm text-gray-500">Điện thoại: {appointment.Patient.user.Phone}</p>
            )}
          </div>

          {/* Appointment Info */}
          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-2">Thông tin khám</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Loại khám</p>
                <p className="font-medium">{appointment.AppointmentType || 'Khám thường'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Khẩn cấp</p>
                <p className="font-medium">{appointment.IsEmergency ? 'Có' : 'Không'}</p>
              </div>
            </div>
          </div>

          {/* Actual Times */}
          {(appointment.ActualStartTime || appointment.ActualEndTime) && (
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-2">Thời gian thực tế</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Bắt đầu</p>
                  <p className="font-medium">{formatTime(appointment.ActualStartTime)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kết thúc</p>
                  <p className="font-medium">{formatTime(appointment.ActualEndTime)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Cancel Reason */}
          {appointment.CancelReason && (
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-2">Lý do hủy</h2>
              <p className="text-gray-600">{appointment.CancelReason}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="border-t p-6 bg-gray-50">
          <div className="flex flex-wrap gap-3">
            {canCancel && (
              <button
                onClick={handleCancel}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {actionLoading ? 'Đang xử lý...' : 'Hủy lịch hẹn'}
              </button>
            )}

            {!canCancel && (
              <p className="text-gray-500 text-sm">Bạn chỉ có thể xem thông tin lịch hẹn</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
