'use client';

import { useState, useEffect } from 'react';
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

export default function PatientDashboardPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('upcoming');
  const [stats, setStats] = useState({
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    reliabilityScore: 100,
    noShowCount: 0,
  });
  
  // Queue state
  const [queueInfo, setQueueInfo] = useState(null);
  
  // User state
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPatient, setCurrentPatient] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        // Fetch patient data using existing endpoint
        fetchPatientData(user.PatientId || user.patientId);
      } catch (e) {
        console.error('Error parsing user', e);
      }
    }
  }, []);

  const fetchPatientData = async (patientId) => {
    if (!patientId) {
      // Nếu không có PatientId, set mặc định
      setStats(prev => ({
        ...prev,
        reliabilityScore: 100,
        noShowCount: 0,
      }));
      return;
    }
    try {
      // Sử dụng endpoint có sẵn để lấy thông tin patient
      const res = await axios.get(`/appointments?PatientId=${patientId}&limit=100`);
      const allAppointments = res.data.data?.appointments || [];
      
      // Đếm no-show
      const noShows = allAppointments.filter(a => a.Status === 'NoShow').length;
      const total = allAppointments.length;
      const reliabilityScore = total > 0 ? Math.max(0, 100 - (noShows * 20)) : 100;
      
      setStats(prev => ({
        ...prev,
        reliabilityScore,
        noShowCount: noShows,
      }));
    } catch (err) {
      console.error('Error fetching patient data:', err);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      
      if (!currentUser?.PatientId && !currentUser?.patientId) {
        setAppointments([]);
        setLoading(false);
        return;
      }

      const patientId = currentUser.PatientId || currentUser.patientId;
      const res = await axios.get(`/appointments?PatientId=${patientId}&limit=50`);
      const allAppointments = res.data.data?.appointments || [];
      
      setAppointments(allAppointments);
      
      // Update stats
      const upcoming = allAppointments.filter(a => 
        ['Pending', 'Confirmed', 'InProgress'].includes(a.Status)
      ).length;
      const completed = allAppointments.filter(a => a.Status === 'Completed').length;
      const cancelled = allAppointments.filter(a => ['Cancelled', 'NoShow'].includes(a.Status)).length;
      
      setStats(prev => ({
        ...prev,
        upcoming,
        completed,
        cancelled,
      }));
      
      // Get nearest upcoming appointment for queue info
      const nearest = allAppointments.find(a => 
        ['Confirmed', 'InProgress'].includes(a.Status)
      );
      if (nearest) {
        setQueueInfo({
          position: '-',
          estimatedWait: '-',
          appointmentTime: nearest.StartTime,
        });
      }
    } catch (err) {
      setError('Không thể tải dữ liệu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchAppointments();
    }
  }, [currentUser, filter]);

  const handleCancelAppointment = async (id) => {
    if (!confirm('Bạn có chắc muốn hủy lịch hẹn này?')) return;
    
    try {
      await axios.patch(`/appointments/${id}/status`, { status: 'Cancelled' });
      alert('Đã hủy lịch hẹn thành công');
      fetchAppointments();
      fetchPatientData(currentUser?.UserId || currentUser?.id);
    } catch (err) {
      alert(err.response?.data?.message || 'Hủy lịch thất bại');
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const badge = statusLabels[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const getReliabilityColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Bệnh nhân</h1>
        {currentUser && (
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
            <div className="w-8 h-8 bg-[#0e6add] rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {currentUser.FullName?.charAt(0) || 'P'}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {currentUser.FullName || 'Bệnh nhân'}
            </span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <Link
          href="/appointments/book"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#0e6add] text-white rounded-lg hover:bg-[#0a5bc4] transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Đặt lịch khám mới
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500 mb-1">Lịch hẹn sắp tới</p>
          <p className="text-2xl font-bold text-[#0e6add]">{stats.upcoming}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500 mb-1">Đã hoàn thành</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500 mb-1">Đã hủy</p>
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500 mb-1">Điểm uy tín</p>
          <p className={`text-2xl font-bold ${getReliabilityColor(stats.reliabilityScore)}`}>
            {stats.reliabilityScore}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500 mb-1">Số lần vắng mặt</p>
          <p className="text-2xl font-bold text-orange-600">{stats.noShowCount}</p>
        </div>
      </div>

      {/* Realtime Queue */}
      {queueInfo && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Hàng đợi thời gian thực
          </h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600">{queueInfo.position || '-'}</p>
                <p className="text-sm text-gray-500">Người phía trước</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-cyan-600">{queueInfo.estimatedWait || '-'}</p>
                <p className="text-sm text-gray-500">Phút chờ ước tính</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Lịch hẹn tiếp theo</p>
              <p className="font-medium text-gray-800">
                {queueInfo.appointmentTime ? formatDateTime(queueInfo.appointmentTime) : '-'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'upcoming', label: 'Sắp tới', icon: '📅' },
          { key: 'completed', label: 'Hoàn thành', icon: '✅' },
          { key: 'cancelled', label: 'Đã hủy', icon: '❌' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              filter === f.key
                ? 'bg-[#0e6add] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{f.icon}</span>
            {f.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Appointments List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Đang tải...</div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow-sm">
          <p className="mb-4">Bạn chưa có lịch hẹn nào</p>
          <Link
            href="/appointments/book"
            className="text-[#0e6add] hover:underline font-medium"
          >
            Đặt lịch khám ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => (
            <div key={apt.AppointmentId} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusBadge(apt.Status)}
                    <span className="text-sm text-gray-500">
                      Mã: #{apt.AppointmentId}
                    </span>
                    {apt.IsEmergency && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-medium">
                        Khẩn cấp
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Ngày giờ</p>
                      <p className="font-medium">{formatDateTime(apt.StartTime)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Bác sĩ</p>
                      <p className="font-medium">
                        {apt.Doctor?.user?.FullName || apt.Doctor?.Specialty || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Loại khám</p>
                      <p className="font-medium">{apt.AppointmentType || 'Khám thường'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Lý do khám</p>
                      <p className="font-medium truncate">{apt.Reason || '-'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  {apt.Status === 'Pending' && (
                    <button
                      onClick={() => handleCancelAppointment(apt.AppointmentId)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                    >
                      Hủy lịch
                    </button>
                  )}
                  <Link
                    href={`/appointments/${apt.AppointmentId}`}
                    className="px-4 py-2 text-[#0e6add] hover:bg-blue-50 rounded-lg transition-colors text-sm"
                  >
                    Chi tiết
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Về điểm uy tín của bạn</h3>
        <p className="text-sm text-gray-600">
          Điểm uy tín bắt đầu từ 100. Mỗi lần không đến khám mà không hủy trước sẽ bị trừ 20 điểm. 
          Bệnh nhân có điểm uy tín cao sẽ được ưu tiên đặt lịch và gợi ý khung giờ tốt hơn.
        </p>
      </div>
    </div>
  );
}
