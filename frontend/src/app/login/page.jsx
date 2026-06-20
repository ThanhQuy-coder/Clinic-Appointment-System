'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        /**
         * Client-side Validation basic
         */
        if (!email || !password) {
            return toast.error('Vui lòng điền đầy đủ thông tin!');
        }

        setIsLoading(true); // Start loading
        const loadingToast = toast.loading('Đang xác thực...');

        try {
            // axios call api login
            const response = await api.post('/users/login', { Email: email, Password: password });

            const { token, user } = response.data.data;
            
            // Save local storage 
            localStorage.setItem('accessToken', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Dispatch event để Navbar cập nhật
            window.dispatchEvent(new Event('user:login'));

            toast.success(`Chào mừng ${user?.name || user?.FullName || 'trở lại'}!`, { id: loadingToast });

            // Chuyển hướng dựa trên role
            setTimeout(() => {
                if (user.Role === 'Patient') {
                    router.push('/dashboard');
                } else {
                    router.push('/admin/dashboard');
                }
            }, 1000);

        } catch (error) {
            const message = error.response?.data?.message || 'Đăng nhập thất bại. Thử lại sau!';
            toast.error(message, { id: loadingToast });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
            <Toaster position="top-right" />
            {/* Khung viền chính */}
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100">

                {/* Nửa bên trái: Banner màu xanh */}
                <div className="w-full md:w-1/2 bg-gradient-to-br from-[#0e6add] to-indigo-600 text-white p-10 md:p-12 flex flex-col justify-center relative overflow-hidden">
                    {/* Họa tiết trang trí */}
                    <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm mb-6">
                            <span className="h-2 w-2 rounded-full bg-emerald-300"></span>
                            Đặt lịch nhanh, theo dõi hàng đợi realtime
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Chào mừng trở lại</h2>
                        <p className="text-blue-100 text-base md:text-lg mb-8 leading-relaxed">
                            Đăng nhập để quản lý lịch hẹn, theo dõi lượt khám và nhận thông báo đúng thời điểm.
                        </p>

                        <div className="grid grid-cols-1 gap-3 text-sm text-blue-50/90">
                            <div className="flex items-start gap-3">
                                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15">✓</span>
                                <p>Trải nghiệm đơn giản, tối ưu cho bệnh nhân.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15">✓</span>
                                <p>Nhận nhắc lịch khám và thông báo đến lượt.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15">✓</span>
                                <p>Dữ liệu được bảo mật theo nguyên tắc tối thiểu.</p>
                            </div>
                        </div>

                        <div className="hidden md:block">
                            <p className="text-sm text-blue-200">Bạn chưa có tài khoản?</p>
                            <Link href="/register" className="inline-block mt-2 px-6 py-2 border-2 border-white/50 rounded-full hover:bg-white hover:text-[#0e6add] font-medium transition-all duration-300">
                                Tạo tài khoản ngay
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Nửa bên phải: Form Đăng nhập */}
                <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-14 flex flex-col justify-center bg-white">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl md:text-3xl font-bold text-slate-900">Đăng nhập</h3>
                        <p className="text-slate-500 mt-2">Vui lòng nhập email và mật khẩu để tiếp tục</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                            <input
                                type="email"
                                disabled={isLoading}
                                required
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0e6add]/30 focus:border-[#0e6add] outline-none transition-all"
                                placeholder="VD: nguyenvan@email.com"
                            />
                            <p className="text-xs text-slate-500 mt-2">Dùng email bạn đã đăng ký trên hệ thống.</p>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-slate-700">Mật khẩu</label>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="text-sm text-[#0e6add] hover:underline"
                                >
                                    {showPassword ? 'Ẩn' : 'Hiện'}
                                </button>
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                disabled={isLoading}
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0e6add]/30 focus:border-[#0e6add] outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#0e6add] text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Đang xử lý...
                                </>
                            ) : 'Đăng nhập'}
                        </button>

                        <div className="text-center text-xs text-slate-500">
                            Bằng việc đăng nhập, bạn đồng ý với các điều khoản sử dụng và chính sách bảo mật.
                        </div>
                    </form>

                    {/* Dành cho Mobile: Nút chuyển sang đăng ký */}
                    <div className="mt-8 text-center md:hidden">
                        <p className="text-gray-600">Bạn chưa có tài khoản?</p>
                        <Link href="/register" className="text-[#0e6add] font-semibold hover:underline">
                            Đăng ký tại đây
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}