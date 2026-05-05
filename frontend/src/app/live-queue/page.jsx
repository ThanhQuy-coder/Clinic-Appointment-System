"use client";

import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Calendar, Clock, User, Stethoscope, Bell, Timer, Users, XCircle, ChevronRight, CheckCircle, ArrowLeft, Search, Filter, CalendarDays, ListFilter, X } from "lucide-react";
import api from "@/lib/axios";

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_URL_SOCKET || "http://localhost:3001";

export default function AppointmentListPage() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientId, setPatientId] = useState(null);
  const socketRef = useRef(null);
  
  // State cho filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date"); // date, doctor, status
  const [showFilters, setShowFilters] = useState(false);
  
  // State cho queue
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [queueData, setQueueData] = useState({
    currentNumber: 0,
    yourNumber: 0,
    numberAhead: 0,
    waitTime: 0,
  });
  const [queueLoading, setQueueLoading] = useState(false);

  // ================= LẤY USER TỪ LOCALSTORAGE =================
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");

      if (!raw) {
        console.log("❌ Không có user trong localStorage");
        setLoading(false);
        return;
      }

      const user = JSON.parse(raw);

      console.log("👤 User từ localStorage:", user);

      const id = user?.Id || user?.patientId;

      console.log(id);

      if (!id) {
        console.log("❌ User không có id hợp lệ");
        setLoading(false);
        return;
      }

      setPatientId(id);
    } catch (err) {
      console.error("❌ Lỗi parse user:", err);
      setLoading(false);
    }
  }, []);

  // ================= CALL API =================
  useEffect(() => {
    if (!patientId) return;

    const fetchData = async () => {
      try {
        const res = await api.get("/appointments", {
          params: {
            PatientId: patientId,
            limit: 50,
          },
        });

        console.log("📦 API response:", res.data);

        const appointments = res.data.data?.appointments || [];
        setData(appointments);
        setFilteredData(appointments);
      } catch (err) {
        console.error("❌ Lỗi gọi API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  // ================= FILTER & SEARCH =================
  useEffect(() => {
    let filtered = [...data];

    // Lọc theo trạng thái
    if (statusFilter !== "all") {
      filtered = filtered.filter(item => item.Status === statusFilter);
    }

    // Tìm kiếm theo tên bác sĩ hoặc chuyên khoa
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item?.doctor?.user?.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.doctor?.Specialty?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sắp xếp
    switch (sortBy) {
      case "date":
        filtered.sort((a, b) => new Date(a.StartTime) - new Date(b.StartTime));
        break;
      case "doctor":
        filtered.sort((a, b) => (a?.doctor?.user?.FullName || "").localeCompare(b?.doctor?.user?.FullName || ""));
        break;
      case "status":
        const statusOrder = { Confirmed: 1, Pending: 2, Completed: 3, Cancelled: 4, NoShow: 5 };
        filtered.sort((a, b) => (statusOrder[a.Status] || 99) - (statusOrder[b.Status] || 99));
        break;
      default:
        break;
    }

    setFilteredData(filtered);
  }, [data, searchTerm, statusFilter, sortBy]);

  // ================= HÀM XEM HÀNG ĐỢI =================
  const handleViewQueue = (appointment) => {
    setSelectedAppointment(appointment);
    fetchQueueStatus(appointment);
  };

  const handleBackToList = () => {
    setSelectedAppointment(null);
    setQueueData({
      currentNumber: 0,
      yourNumber: 0,
      numberAhead: 0,
      waitTime: 0,
    });
    
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  const fetchQueueStatus = async (appointment) => {
    const doctorId = appointment?.doctor?.DoctorId;
    const appointmentId = appointment?.AppointmentId;

    console.log("🔍 Debug:", { doctorId, appointmentId });

    if (!doctorId || !appointmentId) {
      console.log("❌ Thiếu doctorId hoặc appointmentId");
      return;
    }

    setQueueLoading(true);

    try {
      const response = await api.get(`/queue/status`, {
        params: { doctorId, appointmentId },
      });

      setQueueData({
        currentNumber: response.data.currentNumber || 0,
        yourNumber: response.data.yourNumber || 0,
        numberAhead: response.data.numberAhead || 0,
        waitTime: response.data.waitTime || 0,
      });

      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      const socket = io(SOCKET_SERVER_URL);
      socketRef.current = socket;

      socket.on("connect", () => {
        socket.emit("join", { userId: patientId, doctorId });
      });

      socket.on("user:queue:update", (data) => {
        setQueueData(data);
      });

    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu queue:", error);
    } finally {
      setQueueLoading(false);
    }
  };

  // Cleanup socket khi unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSortBy("date");
  };

  // Thống kê số lượng theo trạng thái
  const getStatusCount = (status) => {
    if (status === "all") return data.length;
    return data.filter(item => item.Status === status).length;
  };

  // ================= UI =================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl max-w-md">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Không có lịch hẹn</h2>
          <p className="text-gray-500">Bạn chưa có lịch hẹn nào với bác sĩ</p>
        </div>
      </div>
    );
  }

  // Hiển thị chi tiết hàng đợi
  if (selectedAppointment) {
    const doctorName = selectedAppointment?.doctor?.user?.FullName || "Bác sĩ chưa cập nhật";
    const specialty = selectedAppointment?.doctor?.Specialty || "Không rõ chuyên khoa";

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Quay lại danh sách</span>
            </button>
            
            <div className="border-t pt-4">
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-3 text-white">
                  <Stethoscope className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{doctorName}</h2>
                  <p className="text-gray-500 text-sm mt-1">{specialty}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Mã lịch hẹn: {selectedAppointment.AppointmentId}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Users className="w-6 h-6" />
                Hàng đợi khám bệnh
              </h2>
              <p className="text-blue-100 text-sm mt-1">Cập nhật trực tiếp theo thời gian thực</p>
            </div>

            {queueLoading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-500">Đang tải hàng đợi...</p>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                <div className="flex justify-around items-center py-6">
                  <div className="text-center">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
                      Đang gọi số
                    </p>
                    <div className="text-5xl font-black text-blue-600">
                      {queueData.currentNumber > 0 ? queueData.currentNumber : "---"}
                    </div>
                  </div>
                  <div className="h-16 w-[1px] bg-gray-200"></div>
                  <div className="text-center">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
                      Số của bạn
                    </p>
                    <div className="text-5xl font-black text-gray-800">
                      {queueData.yourNumber === queueData.currentNumber && queueData.yourNumber > 0
                        ? "Đang khám"
                        : queueData.yourNumber === -1 
                          ? "Khám xong" 
                          : (queueData.yourNumber > 0 ? queueData.yourNumber : "---")}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-orange-50 p-5 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <Users className="text-orange-500" size={28} />
                      <span className="text-3xl font-bold text-orange-700">
                        {Number.isFinite(queueData.numberAhead) ? queueData.numberAhead : 0}
                      </span>
                    </div>
                    <p className="text-gray-700 font-medium">Người phía trước</p>
                    <p className="text-gray-500 text-sm mt-1">Số người đang chờ trước bạn</p>
                  </div>

                  <div className="bg-blue-50 p-5 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <Timer className="text-blue-500" size={28} />
                      <span className="text-3xl font-bold text-blue-700">
                        {Number.isFinite(queueData.waitTime) ? queueData.waitTime : 0}
                      </span>
                    </div>
                    <p className="text-gray-700 font-medium">Thời gian chờ</p>
                    <p className="text-gray-500 text-sm mt-1">Thời gian dự kiến (phút)</p>
                  </div>
                </div>

                {queueData.yourNumber > 0 && queueData.currentNumber > 0 && queueData.yourNumber !== queueData.currentNumber && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium text-gray-600">
                      <span>Tiến độ hàng đợi</span>
                      <span>
                        {Math.min(100, Math.round((queueData.currentNumber / queueData.yourNumber) * 100))}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-500 ease-out"
                        style={{ 
                          width: `${Math.min(100, Math.round((queueData.currentNumber / queueData.yourNumber) * 100))}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {queueData.numberAhead <= 2 && queueData.numberAhead > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
                    <Bell className="text-yellow-600 w-5 h-5" />
                    <p className="text-yellow-800 text-sm font-medium">
                      {queueData.numberAhead === 1 
                        ? "⚠️ Sắp đến lượt bạn! Chuẩn bị vào khám." 
                        : `🔔 Còn ${queueData.numberAhead} người phía trước, chuẩn bị nhé!`}
                    </p>
                  </div>
                )}

                {queueData.yourNumber === queueData.currentNumber && queueData.yourNumber > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle className="text-green-600 w-5 h-5" />
                    <p className="text-green-800 text-sm font-medium">
                      🎉 Đến lượt bạn! Vui lòng vào phòng khám.
                    </p>
                  </div>
                )}

                {queueData.yourNumber === -1 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle className="text-blue-600 w-5 h-5" />
                    <p className="text-blue-800 text-sm font-medium">
                      ✅ Bạn đã hoàn thành khám bệnh. Cảm ơn bạn!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Hiển thị danh sách lịch hẹn với bộ lọc
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Danh sách lịch hẹn
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Mã bệnh nhân: <span className="font-mono font-semibold">{patientId}</span>
              </p>
            </div>
            <div className="bg-blue-50 rounded-xl px-4 py-2">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700 font-medium">
                  {filteredData.length} / {data.length} lịch hẹn
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white rounded-2xl shadow-xl p-4 mb-6">
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên bác sĩ hoặc chuyên khoa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">
              {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
            </span>
          </button>

          {showFilters && (
            <div className="space-y-3 pt-2 border-t">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <div className="flex flex-wrap gap-2">
                  {["all", "Confirmed", "Pending", "Completed", "Cancelled", "NoShow"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        statusFilter === status
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {status === "all" ? `Tất cả (${getStatusCount("all")})` : `${status} (${getStatusCount(status)})`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sắp xếp theo
                </label>
                <div className="flex gap-2">
                  {[
                    { value: "date", label: "Ngày khám", icon: CalendarDays },
                    { value: "doctor", label: "Tên bác sĩ", icon: User },
                    { value: "status", label: "Trạng thái", icon: ListFilter }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        sortBy === option.value
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <option.icon className="w-4 h-4" />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Filters */}
              {(searchTerm || statusFilter !== "all" || sortBy !== "date") && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  <X className="w-4 h-4" />
                  Xóa bộ lọc
                </button>
              )}
            </div>
          )}
        </div>

        {/* Kết quả tìm kiếm */}
        {filteredData.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Không tìm thấy kết quả</h3>
            <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        )}

        {/* GRID LIST */}
        <div className="space-y-4">
          {filteredData.map((item) => {
            const doctorName = item?.doctor?.user?.FullName || "Bác sĩ chưa cập nhật";
            const specialty = item?.doctor?.Specialty || "Không rõ chuyên khoa";
            const startTime = item?.StartTime ? new Date(item.StartTime).toLocaleString() : "--";
            const endTime = item?.EndTime ? new Date(item.EndTime).toLocaleString() : "--";

            const statusColors = {
              Completed: "bg-green-100 text-green-700 border-green-200",
              Cancelled: "bg-red-100 text-red-700 border-red-200",
              Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
              Confirmed: "bg-blue-100 text-blue-700 border-blue-200",
              NoShow: "bg-gray-100 text-gray-700 border-gray-200",
            };

            const statusIcons = {
              Completed: <CheckCircle className="w-4 h-4" />,
              Cancelled: <XCircle className="w-4 h-4" />,
              Pending: <Clock className="w-4 h-4" />,
              Confirmed: <Calendar className="w-4 h-4" />,
              NoShow: <XCircle className="w-4 h-4" />,
            };

            const statusClass = statusColors[item.Status] || "bg-gray-100 text-gray-700 border-gray-200";

            return (
              <div
                key={item.AppointmentId}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-2 text-white">
                        <Stethoscope className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                          {doctorName}
                          <span className="text-xs font-normal text-gray-500 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            ID: {item.doctor?.DoctorId?.slice(0, 8)}...
                          </span>
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">{specialty}</p>
                      </div>
                    </div>

                    <div className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 border ${statusClass}`}>
                      {statusIcons[item.Status] || <Bell className="w-3 h-3" />}
                      <span>{item.Status || "Unknown"}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">
                          <span className="font-medium">Bắt đầu:</span> {startTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm">
                          <span className="font-medium">Kết thúc:</span> {endTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        Loại: {item.AppointmentType || "Consultation"}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleViewQueue(item)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 transition-colors"
                    >
                      Xem hàng đợi
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}