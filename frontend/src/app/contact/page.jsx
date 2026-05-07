'use client';

import React, { useState } from 'react';

export default function Contact() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Hàm xử lý khi người dùng bấm nút Gửi
    const handleSubmit = (e) => {
        e.preventDefault();
        // Tạm thời hiển thị thông báo thành công, sau này bạn có thể gọi API gửi email ở đây
        setIsSubmitting(true);
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setIsSubmitting(false);
        }, 2000);
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen py-14">
            <div className="max-w-6xl mx-auto px-5 md:px-8">

                {/* Phần Tiêu đề */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 text-blue-700 px-3 py-1 text-sm mb-4">
                        Liên hệ hỗ trợ
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Liên hệ với chúng tôi</h1>
                    <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto">
                        Bạn cần hỗ trợ đặt lịch, thay đổi lịch hẹn hoặc có góp ý? Hãy để lại thông tin, chúng tôi sẽ phản hồi sớm nhất.
                    </p>
                </div>

                {/* Khung chia 2 cột: Thông tin & Form */}
                <div className="flex flex-col lg:flex-row gap-10 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">

                    {/* Cột trái: Thông tin liên hệ */}
                    <div className="lg:w-2/5 bg-gradient-to-br from-[#0e6add] to-indigo-600 text-white p-10 flex flex-col justify-center">
                        <h2 className="text-2xl font-bold mb-4">Thông tin liên hệ</h2>
                        <p className="text-blue-100 mb-8">
                            Ưu tiên liên hệ hotline nếu bạn cần hỗ trợ gấp.
                        </p>

                        <div className="space-y-6">
                            {/* Mục Địa chỉ */}
                            <div className="flex items-start space-x-4">
                                <svg className="w-6 h-6 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                <div>
                                    <h3 className="font-semibold text-lg">Địa chỉ</h3>
                                    <p className="text-blue-100 mt-1">123 Đường Y Tế, Phường Đa Khoa, Quận Trung Tâm, TP. Hồ Chí Minh</p>
                                </div>
                            </div>

                            {/* Mục Điện thoại */}
                            <div className="flex items-start space-x-4">
                                <svg className="w-6 h-6 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                <div>
                                    <h3 className="font-semibold text-lg">Hotline</h3>
                                    <p className="text-blue-100 mt-1">1900 1234 (Hỗ trợ 24/7)</p>
                                </div>
                            </div>

                            {/* Mục Email */}
                            <div className="flex items-start space-x-4">
                                <svg className="w-6 h-6 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                <div>
                                    <h3 className="font-semibold text-lg">Email</h3>
                                    <p className="text-blue-100 mt-1">hotro@hethongdatlich.vn</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 rounded-2xl bg-white/10 border border-white/15 p-5">
                            <p className="font-semibold mb-2">Thời gian phản hồi</p>
                            <p className="text-blue-100 text-sm leading-relaxed">
                                Thông thường trong vòng <span className="font-semibold text-white">2–8 giờ</span> (giờ hành chính).
                                Với yêu cầu khẩn, vui lòng gọi hotline.
                            </p>
                        </div>
                    </div>

                    {/* Cột phải: Form nhập liệu */}
                    <div className="lg:w-3/5 p-8 md:p-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Gửi tin nhắn</h2>
                        <p className="text-slate-600 mb-6">Điền thông tin dưới đây, chúng tôi sẽ liên hệ lại.</p>

                        {isSubmitted ? (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center">
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Cảm ơn bạn! Yêu cầu đã được ghi nhận.
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Họ và tên *</label>
                                        <input type="text" required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0e6add]/30 focus:border-[#0e6add] outline-none transition-all" placeholder="Nhập họ tên của bạn" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Số điện thoại *</label>
                                        <input type="tel" required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0e6add]/30 focus:border-[#0e6add] outline-none transition-all" placeholder="Nhập số điện thoại" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                    <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0e6add]/30 focus:border-[#0e6add] outline-none transition-all" placeholder="Địa chỉ email của bạn" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Nội dung *</label>
                                    <textarea required rows="5" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0e6add]/30 focus:border-[#0e6add] outline-none transition-all resize-none" placeholder="Vui lòng mô tả vấn đề bạn gặp phải (ví dụ: không đặt được lịch, cần đổi giờ khám...)"></textarea>
                                    <p className="text-xs text-slate-500 mt-2">Không chia sẻ mật khẩu hoặc thông tin nhạy cảm.</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-[#0e6add] text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors duration-300 shadow-md disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Đang gửi...
                                        </>
                                    ) : (
                                        'Gửi yêu cầu'
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                </div>

                <div className="mt-8 grid md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-5">
                        <p className="font-semibold text-slate-900 mb-1">Hỗ trợ đặt lịch</p>
                        <p className="text-slate-600 text-sm">Hướng dẫn chọn bác sĩ, khung giờ và xác nhận.</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-5">
                        <p className="font-semibold text-slate-900 mb-1">Đổi / Hủy lịch</p>
                        <p className="text-slate-600 text-sm">Tư vấn quy trình thay đổi lịch hẹn nhanh chóng.</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-5">
                        <p className="font-semibold text-slate-900 mb-1">Sự cố đăng nhập</p>
                        <p className="text-slate-600 text-sm">Hỗ trợ khi không vào được tài khoản hoặc lỗi token.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}