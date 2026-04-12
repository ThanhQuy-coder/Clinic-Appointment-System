"use client";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Timer, Users, Bell, Clock, XCircle, ChevronRight } from "lucide-react";
import api from '@/lib/axios';

const SOCKET_SERVER_URL = process.env.URL_SOCKET || "http://localhost:3001"; 

export default function LiveQueuePage() {
  const socketRef = useRef(null);
  const [queueData, setQueueData] = useState({
    currentNumber: 0,
    yourNumber: 0,
    waitTime: 0,
  });

  const userId = "106bb68e-edb6-45f6-a4a1-afa51efdc653";
  const doctorId = "d98f253c-5465-4acc-9ee2-5471269c85fe";

  useEffect(() => {
    const fetchInitialStatus = async () => {
      try {
        const response = await api.get(`/queue/queue-status`, {
          params: { userId, doctorId }
        });
        
        // Cập nhật state với dữ liệu thực từ Redis
        setQueueData({
          currentNumber: response.data.currentNumber,
          yourNumber: response.data.yourNumber,
          waitTime: response.data.estimatedTime,
        });
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu ban đầu:", error);
      }
    };

    fetchInitialStatus();

    // Khởi tạo socket
    const socket = io(SOCKET_SERVER_URL);
    socketRef.current = socket;

    // Thiết lập các listener
    socket.on("connect", () => {
      socket.emit("join", { userId, doctorId });
    });

    socket.on("queue_update", (data) => {
      setQueueData(prev => ({
        ...prev,
        currentNumber: data.currentNumber,
        waitTime: data.estimatedTime
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Dùng Axios để gửi yêu cầu "Hủy" hoặc "Đến muộn"
  const handleCancel = async () => {
    try {
      await api.post(`${SOCKET_SERVER_URL}/api/cancel-queue`, { userId, doctorId });
      alert("Đã hủy lịch hẹn");
    } catch (error) {
      console.error("Lỗi khi hủy:", error);
    }
  };

  const peopleAhead = queueData.yourNumber - queueData.currentNumber;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white text-center">
          <h1 className="text-xl font-bold">Hàng Đợi Trực Tuyến</h1>
          <p className="text-blue-100 text-sm opacity-90">Phòng khám Đa khoa</p>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-8">
          
          {/* Queue Status */}
          <div className="flex justify-around items-center py-4">
            <div className="text-center">
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Đang gọi số</p>
              <div className="text-4xl font-black text-blue-600">{queueData.currentNumber}</div>
            </div>
            <div className="h-12 w-[1px] bg-slate-200"></div>
            <div className="text-center">
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Số của bạn</p>
              <div className="text-4xl font-black text-slate-800">{queueData.yourNumber}</div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-orange-50 p-4 rounded-2xl flex flex-col items-center border border-orange-100">
              <Users className="text-orange-500 mb-2" size={24} />
              <span className="text-slate-600 text-xs">Phía trước</span>
              <span className="font-bold text-lg text-orange-700">{peopleAhead > 0 ? peopleAhead : 0} người</span>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl flex flex-col items-center border border-blue-100">
              <Timer className="text-blue-500 mb-2" size={24} />
              <span className="text-slate-600 text-xs">Chờ dự kiến</span>
              <span className="font-bold text-lg text-blue-700">{queueData.waitTime} phút</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-500">
              <span>Tiến độ hàng đợi</span>
              <span>{Math.round((queueData.currentNumber / queueData.yourNumber) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full transition-all duration-500 ease-out"
                style={{ width: `${(queueData.currentNumber / queueData.yourNumber) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 space-y-3">
            <button className="w-full bg-slate-800 hover:bg-black text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-95">
              <Clock size={20} />
              Xin đến muộn (15p)
            </button>
            <button className="w-full bg-white border-2 border-red-100 hover:border-red-200 text-red-500 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-95">
              <XCircle size={20} />
              Hủy lịch hẹn
            </button>
          </div>

        </div>

        {/* Footer Note */}
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase font-medium flex items-center justify-center gap-1">
            <Bell size={12} /> Hệ thống sẽ thông báo khi còn 2 người phía trước
          </p>
        </div>
      </div>
    </div>
  );
}