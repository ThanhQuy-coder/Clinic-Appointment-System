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
            
            toast.success(`Chào mừng ${user?.name || 'trở lại'}!`, { id: loadingToast });

            setTimeout(() => {
                router.push('/');
            }, 1000);

        } catch (error) {
            const message = error.response?.data?.message || 'Đăng nhập thất bại. Thử lại sau!';
            toast.error(message, { id: loadingToast });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            {/* Khung viền chính */}
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

                {/* Nửa bên trái: Banner màu xanh */}
                <div className="w-full md:w-1/2 bg-[#0e6add] text-white p-12 flex flex-col justify-center relative overflow-hidden">
                    {/* Họa tiết trang trí */}
                    <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold mb-6">Chào mừng trở lại!</h2>
                        <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                            Đăng nhập để quản lý lịch hẹn, xem hồ sơ bệnh án và kết nối với các bác sĩ hàng đầu một cách nhanh chóng.
                        </p>
                        <div className="hidden md:block">
                            <p className="text-sm text-blue-200">Bạn chưa có tài khoản?</p>
                            <Link href="/register" className="inline-block mt-2 px-6 py-2 border-2 border-white/50 rounded-full hover:bg-white hover:text-[#0e6add] font-medium transition-all duration-300">
                                Tạo tài khoản ngay
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Nửa bên phải: Form Đăng nhập */}
                <div className="w-full md:w-1/2 p-12 lg:p-16 flex flex-col justify-center bg-white">
                    <div className="text-center mb-8">
                        <h3 className="text-3xl font-bold text-gray-800">Đăng nhập</h3>
                        <p className="text-gray-500 mt-2">Vui lòng nhập thông tin của bạn</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                disabled={isLoading}
                                required
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0e6add] focus:border-transparent outline-none transition-all"
                                placeholder="VD: nguyenvan@email.com"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                                <Link href="#" className="text-sm text-[#0e6add] hover:underline">Quên mật khẩu?</Link>
                            </div>
                            <input
                                type="password" required
                                disabled={isLoading}
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0e6add] focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button type="submit" className="w-full bg-[#0e6add] text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Đang xử lý...
                                </>
                            ) : 'Đăng nhập'}
                        </button>
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