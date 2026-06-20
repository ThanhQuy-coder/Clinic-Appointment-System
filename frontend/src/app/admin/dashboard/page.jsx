'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

export default function AdminDashboardPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        
        if (user.Role !== 'Admin') {
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
    if (selectedDate) {
      fetchAppointments();
    }
  }, [filter, selectedDate]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        Date: selectedDate,
        limit: 50,
      });

      const res = await axios.get(`/appointments?${params.toString()}`);
      const allAppointments = res.data.data?.appointments || [];

      setAppointments(allAppointments);
      setStats({
        total: allAppointments.length,
        pending: allAppointments.filter(a => a.Status === 'Pending').length,
        inProgress: allAppointments.filter(a => a.Status === 'InProgress').length,
        completed: allAppointments.filter(a => a.Status === 'Completed').length,
      });
    } catch (err) {
      setError('Không thể tải dữ liệu dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleMarkArrival = async (id) => {
    try {
      await axios.patch(`/appointments/${id}/arrival`);
      alert('Đã xác nhận bệnh nhân đến');
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`/appointments/${id}/status`, { status: newStatus });
      alert('Cập nhật trạng thái thành công');
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  const getStatusBadge = (status) => {
    const badge = statusLabels[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    if (filter === 'waiting') return apt.Status === 'Pending' || apt.Status === 'Confirmed';
    if (filter === 'inProgress') return apt.Status === 'InProgress';
    if (filter === 'completed') return apt.Status === 'Completed';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Quản trị</h1>
        {currentUser && (
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
            <div className="w-8 h-8 bg-[#0e6add] rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {currentUser.FullName?.charAt(0) || 'U'}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {currentUser.FullName || 'Admin'}
            </span>
            <span className="text-xs text-gray-500">({currentUser.Role || 'Admin'})</span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500 mb-1">Tổng lịch hẹn</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow-sm p-4">
          <p className="text-sm text-yellow-600 mb-1">Chờ xác nhận</p>
          <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-sm p-4">
          <p className="text-sm text-green-600 mb-1">Đang khám</p>
          <p className="text-2xl font-bold text-green-700">{stats.inProgress}</p>
        </div>
        <div className="bg-gray-50 rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">Hoàn thành</p>
          <p className="text-2xl font-bold text-gray-700">{stats.completed}</p>
        </div>
      </div>

      {/* Date Filter */}
      <div className="flex items-center gap-4 mb-6">
        <label className="text-sm font-medium text-gray-700">Ngày:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0e6add] focus:border-transparent"
        />
        <button
          onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          Hôm nay
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'all', label: 'Tất cả' },
          { key: 'waiting', label: 'Đang chờ' },
          { key: 'inProgress', label: 'Đang khám' },
          { key: 'completed', label: 'Hoàn thành' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === f.key
                ? 'bg-[#0e6add] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
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
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow-sm">
          Không có lịch hẹn nào{selectedDate && ` ngày ${new Date(selectedDate + 'T00:00:00').toLocaleDateString('vi-VN')}`}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Giờ</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Bệnh nhân</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Bác sĩ</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Loại</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Trạng thái</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAppointments.map((apt) => (
                <tr key={apt.AppointmentId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    {formatTime(apt.StartTime)}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-sm">
                      {apt.Patient?.user?.FullName || apt.PatientId || '-'}
                    </p>
                    {apt.Patient?.user?.Phone && (
                      <p className="text-xs text-gray-500">{apt.Patient.user.Phone}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {apt.Doctor?.user?.FullName || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {apt.AppointmentType || 'Khám thường'}
                    {apt.IsEmergency && (
                      <span className="ml-2 text-xs text-red-600 font-medium">Khẩn cấp</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(apt.Status)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/appointments/${apt.AppointmentId}`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Chi tiết
                      </Link>
                      {apt.Status === 'Confirmed' && (
                        <button
                          onClick={() => handleMarkArrival(apt.AppointmentId)}
                          className="text-green-600 hover:underline text-sm"
                        >
                          Đến
                        </button>
                      )}
                      {apt.Status === 'InProgress' && (
                        <button
                          onClick={() => handleUpdateStatus(apt.AppointmentId, 'Completed')}
                          className="text-green-600 hover:underline text-sm"
                        >
                          Xong
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
