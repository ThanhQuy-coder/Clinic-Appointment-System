'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_URL_SOCKET || 'http://localhost:3001';

const getStoredUser = () => {
    if (typeof window === 'undefined') return null;

    const savedUser = localStorage.getItem('user');
    if (!savedUser) return null;

    try {
        return JSON.parse(savedUser);
    } catch (e) {
        console.error('Error parsing user data', e);
        return null;
    }
};

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [showNotificationPanel, setShowNotificationPanel] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const isStaff = user?.Role === 'Doctor' || user?.Role === 'Admin';
    const logoHref = isStaff ? '/admin/dashboard' : '/';

    useEffect(() => {
        setIsMounted(true);
        setUser(getStoredUser());

        const loadUser = () => {
            const storedUser = getStoredUser();
            setUser(storedUser);

            if (!storedUser) {
                setNotifications([]);
                setShowNotificationPanel(false);
            }
        };

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('storage', loadUser);
        window.addEventListener('user:login', loadUser);
        window.addEventListener('user:logout', loadUser);
        window.addEventListener('auth:changed', loadUser);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('storage', loadUser);
            window.removeEventListener('user:login', loadUser);
            window.removeEventListener('user:logout', loadUser);
            window.removeEventListener('auth:changed', loadUser);
        };
    }, []);

    useEffect(() => {
        if (!user?.Id) return;

        const socket = io(SOCKET_SERVER_URL);

        socket.on('connect', () => {
            socket.emit('join', { userId: user.Id });
        });

        socket.on('user:notification:new', (payload) => {
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
        window.dispatchEvent(new Event('auth:changed'));
        window.location.href = '/';
    };

    return (
        <nav
            className={`sticky top-0 z-50 flex items-center justify-between px-8 transition-all duration-300 text-black ${
                isScrolled
                    ? 'py-3 bg-white/70 backdrop-blur-md shadow-md'
                    : 'py-4 bg-white shadow-sm'
            }`}
        >
            <div className="flex items-center">
                <Link href={logoHref} className="text-3xl font-bold text-[#0e6add]">
                    Hệ thống đặt lịch
                </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8 font-medium">
                {!isStaff && (
                    <>
                        <Link href="/" className="hover:text-[#0e6add] transition-colors">Trang chủ</Link>
                        <Link href="/about" className="hover:text-[#0e6add] transition-colors">Giới thiệu</Link>
                        <Link href="/faq" className="hover:text-[#0e6add] transition-colors">Trợ giúp</Link>
                        <Link href="/contact" className="hover:text-[#0e6add] transition-colors">Liên hệ</Link>
                    </>
                )}

                {isMounted && user && (
                    <>
                        {!isStaff && (
                            <Link href="/appointments" className="hover:text-[#0e6add] transition-colors">Lịch hẹn</Link>
                        )}
                        {user.Role === 'Patient' && (
                            <>
                                <Link href="/dashboard" className="hover:text-[#0e6add] transition-colors">Dashboard</Link>
                                <Link href="/live-queue" className="hover:text-[#0e6add] transition-colors">Hàng đợi</Link>
                            </>
                        )}
                        {isStaff && (
                            <Link href="/admin/dashboard" className="hover:text-[#0e6add] transition-colors">Dashboard</Link>
                        )}
                    </>
                )}
            </div>

            <div className="flex items-center space-x-2">
                {isMounted && user ? (
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
                                        {notifications.length > 9 ? '9+' : notifications.length}
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
                                            <div key={`${item.sendingTime || ''}-${idx}`} className="px-4 py-3 border-b border-gray-50">
                                                <p className="text-sm font-medium text-gray-800">{item.title || 'Thông báo'}</p>
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
