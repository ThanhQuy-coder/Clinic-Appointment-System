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

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing user', e);
      }
    }
  }, []);

  useEffect(() => {
    if (currentUser?.PatientId || currentUser?.patientId) {
      fetchAppointments();
    } else {
      setLoading(false);
    }
  }, [currentUser, filter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const patientId = currentUser.PatientId || currentUser.patientId;
      const res = await axios.get(`/appointments?PatientId=${patientId}&limit=50`);
      setAppointments(res.data.data?.appointments || []);
    } catch (err) {
      setError('Không thể tải dữ liệu');
      console.error(err);
    } finally {
      setLoading(false);
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

  const handleCancel = async (id) => {
    if (!confirm('Bạn có chắc muốn hủy lịch hẹn này?')) return;
    
    try {
      await axios.patch(`/appointments/${id}/status`, { status: 'Cancelled' });
      alert('Đã hủy lịch hẹn');
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || 'Hủy lịch thất bại');
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return ['Pending', 'Confirmed', 'InProgress'].includes(apt.Status);
    if (filter === 'completed') return apt.Status === 'Completed';
    if (filter === 'cancelled') return ['Cancelled', 'NoShow'].includes(apt.Status);
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Lịch hẹn của tôi</h1>
        <Link
          href="/appointments/book"
          className="px-4 py-2 bg-[#0e6add] text-white rounded-lg hover:bg-[#0a5bc4] transition-colors"
        >
          + Đặt lịch mới
        </Link>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'all', label: 'Tất cả' },
          { key: 'upcoming', label: 'Sắp tới' },
          { key: 'completed', label: 'Hoàn thành' },
          { key: 'cancelled', label: 'Đã hủy' },
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

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Đang tải...</div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow-sm">
          <p>Không có lịch hẹn nào</p>
          <Link href="/appointments/book" className="text-[#0e6add] hover:underline mt-2 inline-block">
            Đặt lịch ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((apt) => (
            <div key={apt.AppointmentId} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      statusLabels[apt.Status]?.color || 'bg-gray-100 text-gray-800'
                    }`}>
                      {statusLabels[apt.Status]?.text || apt.Status}
                    </span>
                    <span className="text-sm text-gray-500">Mã: #{apt.AppointmentId}</span>
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
                      <p className="text-gray-500">Lý do</p>
                      <p className="font-medium truncate">{apt.Reason || '-'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  {apt.Status === 'Pending' && (
                    <button
                      onClick={() => handleCancel(apt.AppointmentId)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                    >
                      Hủy
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
    </div>
  );
}
