'use client'; // Dòng này cực kỳ quan trọng trong Next.js để sử dụng được các hiệu ứng cuộn/click

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_URL_SOCKET || "http://localhost:3001";

const Navbar = () => {
    // Biến state để lưu trạng thái xem đã cuộn chuột hay chưa
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [showNotificationPanel, setShowNotificationPanel] = useState(false);

    useEffect(() => {
        // Kiểm tra xem user đã đăng nhập chưa (từ localStorage)
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error('Error parsing user data', e);
            }
        }

        // Hàm theo dõi sự kiện cuộn chuột
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!user?.Id) return;

        const socket = io(SOCKET_SERVER_URL);

        socket.on("connect", () => {
            socket.emit("join", { userId: user.Id });
        });

        socket.on("user:notification:new", (payload) => {
            setNotifications((prev) => [payload, ...prev].slice(0, 10));
        });

        return () => {
            socket.disconnect();
        };
    }, [user?.Id]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/';
    };

    return (
        <nav
            // Dùng 'sticky top-0' để thanh này luôn bám dính ở trên cùng
            // Dùng toán tử 3 ngôi (isScrolled ? ... : ...) để đổi màu nền khi cuộn
            className={`sticky top-0 z-50 flex items-center justify-between px-8 transition-all duration-300 text-black
        ${isScrolled
                    ? 'py-3 bg-white/70 backdrop-blur-md shadow-md' // Khi cuộn: Trong suốt 70% + Làm mờ (Kính) + Thu nhỏ padding
                    : 'py-4 bg-white shadow-sm' // Khi ở trên cùng: Nền trắng đặc + Padding to hơn
                }
      `}
        >
            {/* Cụm Logo */}
            <div className="flex items-center">
                <Link href="/" className="text-3xl font-bold text-[#0e6add]">
                    Hệ thống đặt lịch
                </Link>
            </div>

            {/* Menu chính ở giữa */}
            <div className="hidden md:flex items-center space-x-8 font-medium">
                <Link href="/" className="hover:text-[#0e6add] transition-colors">Trang chủ</Link>
                <Link href="/about" className="hover:text-[#0e6add] transition-colors">Giới thiệu</Link>
                <Link href="/faq" className="hover:text-[#0e6add] transition-colors">Trợ giúp</Link>
                <Link href="/contact" className="hover:text-[#0e6add] transition-colors">Liên hệ</Link>

                {/* Menu khi đã đăng nhập */}
                {user && (
                    <>
                        <Link href="/appointments" className="hover:text-[#0e6add] transition-colors">Lịch hẹn</Link>
                        {user.Role === 'Patient' && (
                            <Link href="/dashboard" className="hover:text-[#0e6add] transition-colors">Dashboard</Link>,
                            <Link href="/live-queue" className="hover:text-[#0e6add] transition-colors">Hàng đợi</Link>
                        )}
                        {(user.Role === 'Doctor' || user.Role === 'Admin') && (
                            <Link href="/admin/dashboard" className="hover:text-[#0e6add] transition-colors">Dashboard</Link>
                        )}
                    </>
                )}
            </div>

            {/* Nút Đăng nhập bên phải */}
            {/* Cụm nút Đăng ký & Đăng nhập bên phải */}
            <div className="flex items-center space-x-2">
                {user ? (
                    <>
                        <div className="relative">
                            <button
                                onClick={() => setShowNotificationPanel((prev) => !prev)}
                                className="relative px-3 py-2 rounded-full hover:bg-blue-50 transition-colors"
                                aria-label="Thông báo"
                            >
                                <span className="text-lg">🔔</span>
                                {notifications.length > 0 && (
                                    <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                                        {notifications.length > 9 ? "9+" : notifications.length}
                                    </span>
                                )}
                            </button>

                            {showNotificationPanel && (
                                <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto bg-white border border-gray-200 rounded-xl shadow-xl z-50">
                                    <div className="px-4 py-3 border-b border-gray-100 font-semibold text-sm">
                                        Thông báo thời gian thực
                                    </div>
                                    {notifications.length === 0 ? (
                                        <p className="px-4 py-6 text-sm text-gray-500">Chưa có thông báo mới.</p>
                                    ) : (
                                        notifications.map((item, idx) => (
                                            <div key={`${item.sendingTime || ""}-${idx}`} className="px-4 py-3 border-b border-gray-50">
                                                <p className="text-sm font-medium text-gray-800">{item.title || "Thông báo"}</p>
                                                <p className="text-sm text-gray-600 mt-1">{item.message}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        <span className="px-4 py-2 text-gray-600 font-medium">
                            Xin chào, {user.FullName || user.fullName || user.name || 'User'}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-gray-600 font-medium hidden sm:block rounded-full hover:bg-red-50 hover:text-red-600 active:scale-95 transition-all duration-300"
                        >
                            Đăng xuất
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            href="/register"
                            className="px-4 py-2 text-gray-600 font-medium hidden sm:block rounded-full hover:bg-blue-50 hover:text-[#0e6add] active:scale-95 transition-all duration-300"
                        >
                            Đăng ký
                        </Link>
                        <Link
                            href="/login"
                            className="px-6 py-2 text-[#0e6add] font-medium border-2 border-[#0e6add] rounded-full hover:bg-[#0e6add] hover:text-white hover:shadow-[0_8px_15px_rgba(14,106,221,0.3)] hover:-translate-y-0.5 active:scale-95 active:translate-y-0 transition-all duration-300"
                        >
                            Đăng nhập
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
