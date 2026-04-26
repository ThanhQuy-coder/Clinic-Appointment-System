'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import toast, { Toaster } from 'react-hot-toast';

export default function Register() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '', phone: '', email: '', password: '', confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }
        setIsLoading(true);
        const loadingToast = toast.loading('Đang xác thực...');

        try {
            // axios call api register
            const response = await api.post('/users/register', { 
                FullName: formData.fullName, 
                Phone: formData.phone, 
                Email: formData.email, 
                Password: formData.password }
            );

            const { token, user } = response.data.data;
            
            // Save local storage
            localStorage.setItem('accessToken', token);
            
            toast.success(`Đăng ký thành công! Vui lòng đăng nhập.`, { id: loadingToast });

            setTimeout(() => {
                router.push('/login');
            }, 1500);

        } catch (error) {
            const message = error.response?.data?.message || 'Đăng ký thất bại. Thử lại sau!';
            toast.error(message, { id: loadingToast });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            {/* Khung viền chính */}
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col-reverse md:flex-row">

                {/* Nửa bên trái: Form Đăng ký */}
                <div className="w-full md:w-3/5 p-8 lg:p-12 flex flex-col justify-center bg-white">
                    <div className="mb-8">
                        <h3 className="text-3xl font-bold text-gray-800">Tạo tài khoản</h3>
                        <p className="text-gray-500 mt-2">Điền thông tin để bắt đầu sử dụng dịch vụ</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                                <input type="text" name="fullName" required onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0e6add] outline-none transition-all"
                                    placeholder="VD: Nguyễn Văn A" disabled={isLoading} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                                <input type="tel" name="phone" required onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0e6add] outline-none transition-all"
                                    placeholder="VD: 0912345678" disabled={isLoading} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <input type="email" name="email" required onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0e6add] outline-none transition-all"
                                placeholder="VD: nguyenvan@email.com" disabled={isLoading} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu *</label>
                                <input type="password" name="password" required onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0e6add] outline-none transition-all"
                                    placeholder="••••••••" disabled={isLoading} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu *</label>
                                <input type="password" name="confirmPassword" required onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0e6add] outline-none transition-all"
                                    placeholder="••••••••" disabled={isLoading} />
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-[#0e6add] text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 mt-4">
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Đang xử lý...
                                </>
                            ) : 'Đăng ký tài khoản'}
                        </button>
                    </form>

                    {/* Dành cho Mobile: Nút chuyển sang đăng nhập */}
                    <div className="mt-6 text-center md:hidden">
                        <p className="text-gray-600">Đã có tài khoản?</p>
                        <Link href="/login" className="text-[#0e6add] font-semibold hover:underline">
                            Đăng nhập ngay
                        </Link>
                    </div>
                </div>

                {/* Nửa bên phải: Banner màu xanh */}
                <div className="w-full md:w-2/5 bg-[#0e6add] text-white p-12 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold mb-6">Tham gia cùng chúng tôi</h2>
                        <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                            Trải nghiệm dịch vụ y tế thông minh, tiện lợi và chủ động thời gian của bạn chỉ với vài bước đăng ký đơn giản.
                        </p>
                        <div className="hidden md:block">
                            <p className="text-sm text-blue-200">Bạn đã có tài khoản?</p>
                            <Link href="/login" className="inline-block mt-2 px-6 py-2 border-2 border-white/50 rounded-full hover:bg-white hover:text-[#0e6add] font-medium transition-all duration-300">
                                Đăng nhập ngay
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}