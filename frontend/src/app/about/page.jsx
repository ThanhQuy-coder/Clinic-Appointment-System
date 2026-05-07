import React from 'react';

export default function About() {
    return (
        <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen">
            {/* Hero */}
            <div className="px-5 md:px-8 pt-14 pb-10">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-10 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 text-blue-700 px-3 py-1 text-sm mb-4">
                                Về chúng tôi
                            </div>
                            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                                Trải nghiệm đặt lịch khám <span className="text-[#0e6add]">dễ dàng</span> cho bệnh nhân
                            </h1>
                            <p className="text-slate-600 text-base md:text-lg mt-4 leading-relaxed">
                                Chúng tôi xây dựng hệ thống để giúp bệnh nhân chủ động thời gian, giảm chờ đợi và nhận thông báo đúng lúc.
                                Mục tiêu là một UX đơn giản, rõ ràng và đáng tin cậy.
                            </p>
                            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                <a href="/register" className="inline-flex items-center justify-center bg-[#0e6add] text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md">
                                    Tạo tài khoản
                                </a>
                                <a href="/faq" className="inline-flex items-center justify-center bg-white border border-slate-200 text-slate-800 font-semibold px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors">
                                    Xem câu hỏi thường gặp
                                </a>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 md:p-8">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5">
                                    <p className="text-sm text-slate-600">Đặt lịch nhanh</p>
                                    <p className="text-2xl font-extrabold text-slate-900 mt-1">1–2 phút</p>
                                </div>
                                <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-5">
                                    <p className="text-sm text-slate-600">Thông báo realtime</p>
                                    <p className="text-2xl font-extrabold text-slate-900 mt-1">Đúng lúc</p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                                    <p className="text-sm text-slate-600">Theo dõi hàng đợi</p>
                                    <p className="text-2xl font-extrabold text-slate-900 mt-1">Trực tiếp</p>
                                </div>
                                <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-5">
                                    <p className="text-sm text-slate-600">Bảo mật dữ liệu</p>
                                    <p className="text-2xl font-extrabold text-slate-900 mt-1">Ưu tiên</p>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-5">
                                Số liệu minh họa cho trải nghiệm UX mục tiêu trong demo.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-5 md:px-8 pb-14">

                {/* Khung nội dung chi tiết */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-12 mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Tầm nhìn & Sứ mệnh</h2>
                    <p className="text-slate-600 mb-6">
                        Đặt lịch khám nên đơn giản như đặt một cuộc hẹn. Chúng tôi ưu tiên trải nghiệm bệnh nhân: rõ ràng, ít bước, hạn chế sai sót.
                    </p>
                    <div className="text-slate-600 space-y-4 leading-relaxed text-base md:text-lg">
                        <p>
                            Trong thời đại công nghệ số, việc chăm sóc sức khỏe cần được tiếp cận một cách thông minh và nhanh chóng hơn. <strong>Hệ thống đặt lịch khám bệnh</strong> được xây dựng nhằm giải quyết những khó khăn trong việc chờ đợi, xếp hàng và tìm kiếm thông tin bác sĩ.
                        </p>
                        <p>
                            Chúng tôi kết nối bệnh nhân với mạng lưới các bệnh viện, phòng khám và bác sĩ chuyên khoa hàng đầu. Bằng nền tảng công nghệ hiện đại, người dùng có thể dễ dàng tra cứu thông tin, đặt lịch hẹn chính xác theo thời gian thực và quản lý hồ sơ y tế cá nhân một cách an toàn, bảo mật.
                        </p>
                    </div>
                </div>

                {/* Giá trị cốt lõi (Dạng lưới 3 cột) */}
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Box 1: Tiết kiệm thời gian */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center hover:-translate-y-1 transition-transform duration-300">
                        <div className="w-16 h-16 bg-blue-50 text-[#0e6add] rounded-full flex items-center justify-center mx-auto mb-6">
                            {/* Icon Đồng hồ */}
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Tiết kiệm thời gian</h3>
                        <p className="text-slate-600">Chủ động chọn khung giờ khám, giảm chờ đợi tại cơ sở y tế.</p>
                    </div>

                    {/* Box 2: Thông tin minh bạch */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center hover:-translate-y-1 transition-transform duration-300">
                        <div className="w-16 h-16 bg-blue-50 text-[#0e6add] rounded-full flex items-center justify-center mx-auto mb-6">
                            {/* Icon Tấm khiên */}
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Minh bạch</h3>
                        <p className="text-slate-600">Thông tin bác sĩ, lịch khám và trạng thái được hiển thị rõ ràng.</p>
                    </div>

                    {/* Box 3: Đội ngũ hàng đầu */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center hover:-translate-y-1 transition-transform duration-300">
                        <div className="w-16 h-16 bg-blue-50 text-[#0e6add] rounded-full flex items-center justify-center mx-auto mb-6">
                            {/* Icon Bác sĩ/Người */}
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Trải nghiệm thân thiện</h3>
                        <p className="text-slate-600">Thiết kế ưu tiên bệnh nhân: dễ dùng, ít thao tác, rõ trạng thái.</p>
                    </div>
                </div>

                <div className="mt-10 bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-10 text-center">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900">Bắt đầu đặt lịch ngay hôm nay</h3>
                    <p className="text-slate-600 mt-2 max-w-2xl mx-auto">
                        Tạo tài khoản để quản lý lịch hẹn, nhận nhắc lịch và theo dõi hàng đợi theo thời gian thực.
                    </p>
                    <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                        <a href="/register" className="inline-flex items-center justify-center bg-[#0e6add] text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md">
                            Đăng ký miễn phí
                        </a>
                        <a href="/login" className="inline-flex items-center justify-center bg-slate-100 text-slate-900 font-semibold px-8 py-3 rounded-xl hover:bg-slate-200 transition-colors">
                            Tôi đã có tài khoản
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
}