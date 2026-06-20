'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from '@/lib/axios';
import toast, { Toaster } from 'react-hot-toast';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_URL_SOCKET || 'http://localhost:3001';

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
  const [queueCurrent, setQueueCurrent] = useState(null);
  const [queueLoading, setQueueLoading] = useState(false);
  const [queueError, setQueueError] = useState(null);
  const [queueConnected, setQueueConnected] = useState(false);

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
    if (currentUser) {
      fetchAppointments();
    }
  }, [filter, selectedDate, currentUser]);

  useEffect(() => {
    if (currentUser?.Role !== 'Doctor') return;

    fetchDoctorCurrentQueue();

    const socket = io(SOCKET_SERVER_URL);

    socket.on('connect', () => {
      setQueueConnected(true);
      socket.emit('join', { userId: currentUser.Id, doctorId: currentUser.Id });
    });

    socket.on('disconnect', () => {
      setQueueConnected(false);
    });

    socket.on('doctor:queue:update', () => {
      fetchDoctorCurrentQueue();
      fetchAppointments();
    });

    return () => {
      socket.disconnect();
      setQueueConnected(false);
    };
  }, [currentUser]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        Date: selectedDate,
        limit: 1000,
      });
      if (selectedDate) {
        params.set('Date', selectedDate);
      }
      if (currentUser?.Role === 'Doctor') {
        params.set('DoctorId', currentUser.Id);
      }

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

  const fetchDoctorCurrentQueue = async () => {
    if (currentUser?.Role !== 'Doctor') return;

    try {
      setQueueLoading(true);
      setQueueError(null);
      const res = await axios.get(`/queue/current?doctorId=${currentUser.Id}`);
      setQueueCurrent(res.data.data || null);
    } catch (err) {
      setQueueCurrent(null);
      setQueueError(err.response?.data?.message || 'No active patient in queue');
    } finally {
      setQueueLoading(false);
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

  const currentQueueAppointment = queueCurrent?.appointmentId
    ? appointments.find((apt) => String(apt.AppointmentId) === String(queueCurrent.appointmentId))
    : null;

  const nextConfirmedAppointment = appointments.find((apt) => apt.Status === 'Confirmed');

  const handleCallNextPatient = async () => {
    try {
      const res = await axios.get(`/queue/next?doctorId=${currentUser.Id}`);
      const nextJob = res.data.data;

      if (!nextJob?.appointmentId) {
        alert(res.data.message || 'No patient is waiting in this queue');
        return;
      }

      await axios.patch(`/appointments/${nextJob.appointmentId}/status`, { status: 'InProgress' });
      await fetchAppointments();
      await fetchDoctorCurrentQueue();
    } catch (err) {
      alert(err.response?.data?.message || 'Cannot call the next patient');
    }
  };

  const handleFinishCurrentPatient = async (status) => {
    const appointmentId = queueCurrent?.appointmentId || currentQueueAppointment?.AppointmentId;
    if (!appointmentId) {
      alert('No active patient in queue');
      return;
    }

    await handleUpdateStatus(appointmentId, status);
    await fetchDoctorCurrentQueue();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {currentUser?.Role === 'Doctor' ? 'Dashboard Bác sĩ' : 'Dashboard Quản trị'}
        </h1>
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

      {currentUser?.Role === 'Doctor' && (
        <div className="bg-white rounded-lg shadow-sm p-5 mb-8 border border-blue-100">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Hàng đợi hiện tại</h2>
              <p className="text-sm text-gray-500">
                {queueConnected ? 'Đang cập nhật realtime' : 'Đang dùng dữ liệu tải lại thủ công'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={fetchDoctorCurrentQueue}
                disabled={queueLoading}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors text-sm"
              >
                Làm mới
              </button>
              <button
                onClick={handleCallNextPatient}
                disabled={queueLoading || !!queueCurrent}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
              >
                Gọi bệnh nhân tiếp theo
              </button>
            </div>
          </div>

          {queueLoading ? (
            <div className="py-6 text-sm text-gray-500">Đang tải hàng đợi...</div>
          ) : queueCurrent ? (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-center">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Bệnh nhân</p>
                  <p className="font-semibold text-gray-800">
                    {currentQueueAppointment?.patient?.user?.FullName ||
                      currentQueueAppointment?.Patient?.user?.FullName ||
                      queueCurrent.patientId ||
                      '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mã lịch</p>
                  <p className="font-semibold text-gray-800">
                    {queueCurrent.appointmentId || currentQueueAppointment?.AppointmentId || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Giờ khám</p>
                  <p className="font-semibold text-gray-800">
                    {currentQueueAppointment?.StartTime ? formatTime(currentQueueAppointment.StartTime) : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Còn chờ</p>
                  <p className="font-semibold text-gray-800">
                    {queueCurrent.numberAhead ?? 0} bệnh nhân
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleFinishCurrentPatient('Completed')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Hoàn thành
                </button>
                <button
                  onClick={() => handleFinishCurrentPatient('NoShow')}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                >
                  Không đến
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3 py-4">
              <p className="text-sm text-gray-500">
                {queueError || 'Không có bệnh nhân đang khám.'}
              </p>
              {nextConfirmedAppointment && (
                <p className="text-sm text-gray-600">
                  Bệnh nhân tiếp theo: {nextConfirmedAppointment.patient?.user?.FullName || nextConfirmedAppointment.Patient?.user?.FullName || nextConfirmedAppointment.PatientId}
                </p>
              )}
            </div>
          )}
        </div>
      )}

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
        <button
          onClick={() => setSelectedDate('')}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          Tất cả
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
                      {apt.patient?.user?.FullName || apt.Patient?.user?.FullName || apt.PatientId || '-'}
                    </p>
                    {(apt.patient?.user?.Phone || apt.Patient?.user?.Phone) && (
                      <p className="text-xs text-gray-500">{apt.patient?.user?.Phone || apt.Patient.user.Phone}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {apt.doctor?.user?.FullName || apt.Doctor?.user?.FullName || '-'}
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
