'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import toast, { Toaster } from 'react-hot-toast';

export default function Register() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '', phone: '', email: '', password: '', confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return toast.error('Mật khẩu xác nhận không khớp!');
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
            <Toaster position="top-right" />
            {/* Khung viền chính */}
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col-reverse md:flex-row border border-slate-100">

                {/* Nửa bên trái: Form Đăng ký */}
                <div className="w-full md:w-3/5 p-8 lg:p-12 flex flex-col justify-center bg-white">
                    <div className="mb-8">
                        <h3 className="text-2xl md:text-3xl font-bold text-slate-900">Tạo tài khoản</h3>
                        <p className="text-slate-500 mt-2">Chỉ mất khoảng 1 phút để bắt đầu đặt lịch</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Họ và tên *</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    required
                                    onChange={handleChange}
                                    value={formData.fullName}
                                    autoComplete="name"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0e6add]/30 focus:border-[#0e6add] outline-none transition-all"
                                    placeholder="VD: Nguyễn Văn A"
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Số điện thoại *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    onChange={handleChange}
                                    value={formData.phone}
                                    autoComplete="tel"
                                    inputMode="tel"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0e6add]/30 focus:border-[#0e6add] outline-none transition-all"
                                    placeholder="VD: 0912345678"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                            <input
                                type="email"
                                name="email"
                                required
                                onChange={handleChange}
                                value={formData.email}
                                autoComplete="email"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0e6add]/30 focus:border-[#0e6add] outline-none transition-all"
                                placeholder="VD: nguyenvan@email.com"
                                disabled={isLoading}
                            />
                            <p className="text-xs text-slate-500 mt-2">Chúng tôi sẽ dùng email này để gửi xác nhận/nhắc lịch.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-slate-700">Mật khẩu *</label>
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
                                    name="password"
                                    required
                                    onChange={handleChange}
                                    value={formData.password}
                                    autoComplete="new-password"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0e6add]/30 focus:border-[#0e6add] outline-none transition-all"
                                    placeholder="Ít nhất 6 ký tự"
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-slate-700">Xác nhận mật khẩu *</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((v) => !v)}
                                        className="text-sm text-[#0e6add] hover:underline"
                                    >
                                        {showConfirmPassword ? 'Ẩn' : 'Hiện'}
                                    </button>
                                </div>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    required
                                    onChange={handleChange}
                                    value={formData.confirmPassword}
                                    autoComplete="new-password"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0e6add]/30 focus:border-[#0e6add] outline-none transition-all"
                                    placeholder="Nhập lại mật khẩu"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 text-sm text-slate-700">
                            <p className="font-semibold text-slate-800 mb-1">Gợi ý để đăng ký nhanh</p>
                            <ul className="list-disc pl-5 space-y-1 text-slate-600">
                                <li>Nhập đúng số điện thoại để tiện liên hệ.</li>
                                <li>Dùng email thường xuyên để nhận nhắc lịch khám.</li>
                            </ul>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#0e6add] text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 mt-2 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Đang xử lý...
                                </>
                            ) : 'Đăng ký tài khoản'}
                        </button>

                        <p className="text-xs text-slate-500 text-center">
                            Khi đăng ký, bạn đồng ý với điều khoản sử dụng và chính sách bảo mật.
                        </p>
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
                <div className="w-full md:w-2/5 bg-gradient-to-br from-[#0e6add] to-indigo-600 text-white p-10 md:p-12 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm mb-6">
                            <span className="h-2 w-2 rounded-full bg-emerald-300"></span>
                            Miễn phí tạo tài khoản
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Tham gia cùng chúng tôi</h2>
                        <p className="text-blue-100 text-base md:text-lg mb-8 leading-relaxed">
                            Trải nghiệm đặt lịch khám tiện lợi, minh bạch và dễ dàng cho bệnh nhân.
                        </p>

                        <div className="grid grid-cols-1 gap-3 text-sm text-blue-50/90">
                            <div className="flex items-start gap-3">
                                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15">✓</span>
                                <p>Chủ động chọn giờ khám phù hợp.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15">✓</span>
                                <p>Thông báo nhắc lịch và đến lượt khám.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15">✓</span>
                                <p>Quản lý lịch hẹn ngay trên điện thoại.</p>
                            </div>
                        </div>
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