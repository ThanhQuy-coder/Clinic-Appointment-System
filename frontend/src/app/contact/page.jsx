'use client';

import React, { useState } from 'react';

export default function Contact() {
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Hàm xử lý khi người dùng bấm nút Gửi
    const handleSubmit = (e) => {
        e.preventDefault();
        // Tạm thời hiển thị thông báo thành công, sau này bạn có thể gọi API gửi email ở đây
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 5000); // Tắt thông báo sau 5 giây
    };

    return (
        <div className="bg-gray-50 min-h-screen py-16">
            <div className="max-w-6xl mx-auto px-8">

                {/* Phần Tiêu đề */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-[#0e6add] mb-4">Liên hệ với chúng tôi</h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Bạn có câu hỏi hoặc cần hỗ trợ? Hãy để lại thông tin, đội ngũ chăm sóc khách hàng của chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.
                    </p>
                </div>

                {/* Khung chia 2 cột: Thông tin & Form */}
                <div className="flex flex-col lg:flex-row gap-12 bg-white rounded-2xl shadow-sm overflow-hidden">

                    {/* Cột trái: Thông tin liên hệ */}
                    <div className="lg:w-2/5 bg-[#0e6add] text-white p-10 flex flex-col justify-center">
                        <h2 className="text-2xl font-bold mb-8">Thông tin liên hệ</h2>

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
                    </div>

                    {/* Cột phải: Form nhập liệu */}
                    <div className="lg:w-3/5 p-10">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Gửi tin nhắn cho chúng tôi</h2>

                        {isSubmitted ? (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Cảm ơn bạn! Lời nhắn đã được gửi thành công.
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên *</label>
                                        <input type="text" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0e6add] focus:border-transparent outline-none transition-all" placeholder="Nhập họ tên của bạn" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại *</label>
                                        <input type="tel" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0e6add] focus:border-transparent outline-none transition-all" placeholder="Nhập số điện thoại" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0e6add] focus:border-transparent outline-none transition-all" placeholder="Địa chỉ email của bạn" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung tin nhắn *</label>
                                    <textarea required rows="4" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0e6add] focus:border-transparent outline-none transition-all resize-none" placeholder="Vui lòng nhập nội dung bạn cần hỗ trợ..."></textarea>
                                </div>

                                <button type="submit" className="w-full bg-[#0e6add] text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md">
                                    Gửi lời nhắn
                                </button>
                            </form>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}