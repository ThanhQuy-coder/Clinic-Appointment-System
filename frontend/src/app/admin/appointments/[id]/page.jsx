'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from '@/lib/axios';
import toast, { Toaster } from 'react-hot-toast';

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
  const router = useRouter();
  const appointmentId = params.id;
  
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        
        if (!['Admin', 'Doctor'].includes(user.Role)) {
          toast.error('Bạn không có quyền truy cập trang này');
          router.push('/');
        }
      } catch (e) {
        console.error('Error parsing user', e);
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (appointmentId && ['Admin', 'Doctor'].includes(currentUser?.Role)) {
      fetchAppointment();
    }
  }, [appointmentId, currentUser]);

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/appointments/${appointmentId}`);
      const data = res.data.data;
      if (currentUser?.Role === 'Doctor' && data?.DoctorId !== currentUser.Id) {
        toast.error('Bạn không có quyền xem lịch hẹn này');
        router.push('/admin/dashboard');
        return;
      }
      setAppointment(data);
    } catch (err) {
      setError('Không thể tải thông tin lịch hẹn');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      setUpdating(true);
      await axios.patch(`/appointments/${appointmentId}/status`, { status: newStatus });
      toast.success('Cập nhật trạng thái thành công');
      fetchAppointment();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkArrival = async () => {
    try {
      setUpdating(true);
      await axios.patch(`/appointments/${appointmentId}/arrival`);
      toast.success('Đã xác nhận bệnh nhân đến');
      fetchAppointment();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const badge = statusLabels[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          {error || 'Không tìm thấy lịch hẹn'}
        </div>
        <Link href="/admin/dashboard" className="text-blue-600 hover:underline">
          ← Quay lại Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/dashboard" className="text-blue-600 hover:underline text-sm mb-2 inline-block">
            ← Quay lại Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Chi tiết lịch hẹn</h1>
        </div>
        {getStatusBadge(appointment.Status)}
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-bold text-lg">
              {(appointment.patient?.user?.FullName || appointment.Patient?.user?.FullName)?.charAt(0) || 'P'}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {appointment.patient?.user?.FullName || appointment.Patient?.user?.FullName || 'Bệnh nhân'}
            </h2>
            <p className="text-gray-500 text-sm">
              Mã lịch hẹn: {appointment.AppointmentId}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thời gian */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Ngày hẹn</h3>
            <p className="text-gray-800">{formatDate(appointment.AppointmentDate)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Giờ hẹn</h3>
            <p className="text-gray-800">
              {formatTime(appointment.StartTime)} - {formatTime(appointment.EndTime)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Bác sĩ</h3>
            <p className="text-gray-800">
              {appointment.doctor?.user?.FullName || appointment.Doctor?.user?.FullName || appointment.Doctor?.FullName || '-'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Chuyên khoa</h3>
            <p className="text-gray-800">
              {appointment.Department?.DepartmentName || appointment.DepartmentName || '-'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Loại khám</h3>
            <p className="text-gray-800">
              {appointment.AppointmentType || 'Khám thường'}
              {appointment.IsEmergency && (
                <span className="ml-2 text-xs text-red-600 font-medium bg-red-50 px-2 py-0.5 rounded">
                  Khẩn cấp
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Lý do khám */}
        {appointment.Reason && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Lý do khám</h3>
            <p className="text-gray-800">{appointment.Reason}</p>
          </div>
        )}

        {/* Ghi chú */}
        {appointment.Notes && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Ghi chú</h3>
            <p className="text-gray-800">{appointment.Notes}</p>
          </div>
        )}
      </div>

      {/* Patient Info Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin bệnh nhân</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Họ tên</p>
            <p className="text-gray-800 font-medium">
              {appointment.patient?.user?.FullName || appointment.Patient?.user?.FullName || '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Số điện thoại</p>
            <p className="text-gray-800">
              {appointment.patient?.user?.Phone || appointment.Patient?.user?.Phone || '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-gray-800">
              {appointment.patient?.user?.Email || appointment.Patient?.user?.Email || '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Điểm uy tín</p>
            <p className="text-gray-800">
              {appointment.patient?.ReliabilityScore ?? appointment.Patient?.ReliabilityScore ?? '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Thao tác</h3>
        <div className="flex flex-wrap gap-3">
          {appointment.Status === 'Pending' && (
            <>
              <button
                onClick={() => handleUpdateStatus('Confirmed')}
                disabled={updating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Xác nhận lịch hẹn
              </button>
              <button
                onClick={() => handleUpdateStatus('Cancelled')}
                disabled={updating}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Hủy lịch hẹn
              </button>
            </>
          )}
          {appointment.Status === 'Confirmed' && (
            <>
              <button
                onClick={handleMarkArrival}
                disabled={updating}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Xác nhận bệnh nhân đến
              </button>
              <button
                onClick={() => handleUpdateStatus('NoShow')}
                disabled={updating}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                Không đến
              </button>
            </>
          )}
          {appointment.Status === 'InProgress' && (
            <button
              onClick={() => handleUpdateStatus('Completed')}
              disabled={updating}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Hoàn thành khám
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
