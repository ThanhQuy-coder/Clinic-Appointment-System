'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from '@/lib/axios';

export default function BookAppointmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  const [formData, setFormData] = useState({
    doctorId: '',
    patientId: '',
    date: '',
    appointmentType: 'Regular',
    isEmergency: false,
  });

  const [selectedTime, setSelectedTime] = useState('09:00');
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  // Get patientId from localStorage directly
  const getPatientId = () => {
    if (typeof window === 'undefined') return '';
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        return user.PatientId || user.Id || '';
      } catch (e) {
        console.error('Error parsing user', e);
      }
    }
    return '';
  };

  // Set initial date on client only (avoid hydration mismatch)
  useEffect(() => {
    const now = new Date();
    // Use local time for date (not UTC)
    const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    // Calculate next available time slot (rounded up to nearest 30 minutes)
    const currentMinutes = now.getMinutes();
    const roundedMinutes = currentMinutes < 30 ? 30 : 0;
    let roundedHours = now.getHours();
    if (currentMinutes >= 30) roundedHours += 1;
    const localTime = `${String(roundedHours).padStart(2, '0')}:${String(roundedMinutes).padStart(2, '0')}`;
    
    setFormData(prev => ({ ...prev, date: localDate }));
    setSelectedTime(localTime);
    setIsMounted(true);
  }, []);

  // Fetch doctors list
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get('/doctors');
        setDoctors(res.data.data || []);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (formData.doctorId || formData.date) {
      fetchSuggestions();
    }
  }, [formData.doctorId, formData.date]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        date: formData.date,
        appointmentType: formData.appointmentType,
      });
      if (formData.doctorId) params.append('doctorId', formData.doctorId);

      const res = await axios.get(`/appointments/suggestions?${params.toString()}`);
      setSuggestions(res.data.data?.suggestions || []);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
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

  const handleSelectSuggestion = (suggestion) => {
    setSelectedSuggestion(suggestion);
    // Extract time from suggestion
    const startTime = new Date(suggestion.startTime);
    const hours = String(startTime.getHours()).padStart(2, '0');
    const minutes = String(startTime.getMinutes()).padStart(2, '0');
    setSelectedTime(`${hours}:${minutes}`);
    setFormData({ ...formData, doctorId: suggestion.doctorId });
  };

  // Handle date change - reset time if selecting past date
  const handleDateChange = (newDate) => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    if (newDate === today) {
      // If selecting today, ensure time is not in the past
      const minTime = getMinTime();
      const [minH, minM] = minTime.split(':').map(Number);
      const [currH, currM] = selectedTime.split(':').map(Number);
      const minMinutes = minH * 60 + minM;
      const currMinutes = currH * 60 + currM;
      if (currMinutes < minMinutes) {
        setSelectedTime(minTime);
      }
    }

    setFormData({ ...formData, date: newDate });
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
    setSelectedSuggestion(null); // Clear suggestion when manually selecting time
  };

  const handleConfirm = () => {
    const patientId = getPatientId();
    if (!patientId) {
      setError('Vui lòng đăng nhập để đặt lịch');
      return;
    }
    if (!formData.doctorId) {
      setError('Vui lòng chọn bác sĩ');
      return;
    }
    if (!formData.date) {
      setError('Vui lòng chọn ngày khám');
      return;
    }
    setFormData(prev => ({ ...prev, patientId }));
    setError(null);
    setStep(2);
  };

  const getEndTime = () => {
    if (selectedSuggestion) {
      return formatTime(selectedSuggestion.endTime);
    }
    // Calculate end time based on appointment type
    const durationMinutes = formData.appointmentType === 'Emergency' ? 30 : 
                            formData.appointmentType === 'Follow-up' ? 20 : 30;
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const endMinutes = minutes + durationMinutes;
    const endHours = hours + Math.floor(endMinutes / 60);
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`;
  };

  // Helper function to create date from date string and time string (handles timezone correctly)
  const createLocalDateTime = (dateStr, timeStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes, 0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const patientId = getPatientId();
    if (!patientId) {
      setError('Vui lòng đăng nhập để đặt lịch');
      return;
    }

    // Validate: cannot book in the past
    const appointmentTime = createLocalDateTime(formData.date, selectedTime);
    const now = new Date();
    if (appointmentTime <= now) {
      setError('Không thể đặt lịch trong quá khứ. Vui lòng chọn thời gian trong tương lai.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const durationMinutes = formData.appointmentType === 'Emergency' ? 30 : 
                              formData.appointmentType === 'Follow-up' ? 20 : 30;
      const startTime = appointmentTime;
      const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

      const payload = {
        PatientId: patientId,
        DoctorId: formData.doctorId,
        StartTime: startTime.toISOString(),
        EndTime: endTime.toISOString(),
        AppointmentType: formData.appointmentType,
        IsEmergency: formData.isEmergency,
      };

      await axios.post('/appointments', payload);
      alert('Đặt lịch thành công!');
      router.push('/appointments');
    } catch (err) {
      setError(err.response?.data?.message || 'Đặt lịch thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const getDoctorName = () => {
    if (selectedSuggestion) {
      return `${selectedSuggestion.doctorName} (${selectedSuggestion.specialty || 'Chuyên khoa'})`;
    }
    const doctor = doctors.find(d => d.DoctorId === formData.doctorId);
    return doctor ? `${doctor.user?.FullName || 'Bác sĩ'} - ${doctor.Specialty}` : 'Chưa chọn';
  };

  // Get minimum time (current time + 30 minutes, in HH:MM format)
  const getMinTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  // Check if selected date is today
  const isToday = () => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    return formData.date === today;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Đặt lịch khám</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Progress Steps */}
      <div className="flex items-center mb-8">
        <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          <span className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            1
          </span>
          <span className="ml-2">Chọn thông tin</span>
        </div>
        <div className="flex-1 h-px bg-gray-300 mx-4"></div>
        <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <span className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            2
          </span>
          <span className="ml-2">Xác nhận</span>
        </div>
      </div>

      {/* Loading overlay for SSR hydration */}
      {!isMounted && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {isMounted && step === 1 && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày khám</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại khám</label>
                <select
                  value={formData.appointmentType}
                  onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Regular">Khám thường</option>
                  <option value="Follow-up">Tái khám</option>
                  <option value="Emergency">Cấp cứu</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bác sĩ</label>
                <select
                  value={formData.doctorId}
                  onChange={(e) => {
                    setFormData({ ...formData, doctorId: e.target.value });
                    setSelectedSuggestion(null);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Chọn bác sĩ --</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.DoctorId} value={doctor.DoctorId}>
                      {doctor.user?.FullName || 'Bác sĩ'} - {doctor.Specialty}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Giờ khám - Time Picker */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Giờ khám</label>
              <div className="flex items-center gap-4">
                <input
                  type="time"
                  value={selectedTime}
                  min={isToday() ? getMinTime() : undefined}
                  onChange={handleTimeChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-500">
                  {selectedSuggestion ? (
                    <span className="text-green-600">Đã chọn từ gợi ý</span>
                  ) : (
                    <span>Chọn thủ công hoặc chọn từ gợi ý bên dưới</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4">Gợi ý lịch khám</h2>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Đang tải...</div>
            ) : suggestions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Không có gợi ý nào. Vui lòng chọn ngày khác hoặc bác sĩ khác.
              </div>
            ) : (
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                      selectedSuggestion === suggestion 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-500'
                    }`}
                    onClick={() => handleSelectSuggestion(suggestion)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {suggestion.doctorName || suggestion.doctorId}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {suggestion.specialty || 'Chuyên khoa'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-blue-600">
                          {formatTime(suggestion.startTime)}
                        </p>
                        <p className="text-sm text-gray-500">
                          ~{suggestion.estimatedDuration} phút
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex gap-4 text-sm text-gray-500">
                      <span>Số người chờ: {suggestion.queueDepth || 0}</span>
                      <span>Tải bác sĩ: {suggestion.doctorLoadPercent || 0}%</span>
                      <span>Điểm: {suggestion.score?.toFixed(1) || '-'}</span>
                    </div>
                    {selectedSuggestion === suggestion && (
                      <div className="mt-2 text-sm text-blue-600 font-medium">
                        ✓ Đã chọn
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirm Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleConfirm}
              className="px-6 py-2 bg-[#0e6add] text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Xác nhận
            </button>
          </div>
        </div>
      )}

      {isMounted && step === 2 && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Xác nhận thông tin đặt lịch</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bác sĩ</label>
              <input
                type="text"
                value={getDoctorName()}
                disabled
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày khám</label>
                <input
                  type="text"
                  value={formData.date}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giờ khám</label>
                <input
                  type="text"
                  value={`${selectedTime} - ${getEndTime()}`}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại khám</label>
              <select
                value={formData.appointmentType}
                onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Regular">Khám thường</option>
                <option value="Follow-up">Tái khám</option>
                <option value="Emergency">Cấp cứu</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isEmergency"
                checked={formData.isEmergency}
                onChange={(e) => setFormData({ ...formData, isEmergency: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isEmergency" className="ml-2 text-sm text-gray-700">
                Đánh dấu là lịch khẩn cấp
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Quay lại
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#0e6add] text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : 'Xác nhận đặt lịch'}
            </button>
          </div>
        </form>
      )}

      <div className="mt-4">
        <Link href="/appointments" className="text-blue-600 hover:underline">
          ← Quay lại danh sách lịch hẹn
        </Link>
      </div>
    </div>
  );
}
