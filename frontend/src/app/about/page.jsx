import React from 'react';

export default function About() {
    return (
        <div className="bg-gray-50 min-h-screen py-16">
            <div className="max-w-6xl mx-auto px-8">

                {/* Phần Tiêu đề chính */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-[#0e6add] mb-4">Về Chúng Tôi</h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Chúng tôi ra đời với sứ mệnh mang lại trải nghiệm y tế tiện lợi, minh bạch và dễ dàng nhất cho mọi người.
                    </p>
                </div>

                {/* Khung nội dung chi tiết */}
                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Tầm nhìn & Sứ mệnh</h2>
                    <div className="text-gray-600 space-y-4 leading-relaxed text-lg">
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
                    <div className="bg-white p-8 rounded-2xl shadow-sm text-center hover:-translate-y-2 transition-transform duration-300 border-t-4 border-transparent hover:border-[#0e6add]">
                        <div className="w-16 h-16 bg-blue-50 text-[#0e6add] rounded-full flex items-center justify-center mx-auto mb-6">
                            {/* Icon Đồng hồ */}
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Tiết kiệm thời gian</h3>
                        <p className="text-gray-500">Chủ động chọn khung giờ khám, không còn cảnh xếp hàng chờ đợi mệt mỏi tại bệnh viện.</p>
                    </div>

                    {/* Box 2: Thông tin minh bạch */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm text-center hover:-translate-y-2 transition-transform duration-300 border-t-4 border-transparent hover:border-[#0e6add]">
                        <div className="w-16 h-16 bg-blue-50 text-[#0e6add] rounded-full flex items-center justify-center mx-auto mb-6">
                            {/* Icon Tấm khiên */}
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Thông tin minh bạch</h3>
                        <p className="text-gray-500">Mọi thông tin về bác sĩ, chuyên môn, lịch trình và chi phí khám bệnh đều được công khai rõ ràng.</p>
                    </div>

                    {/* Box 3: Đội ngũ hàng đầu */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm text-center hover:-translate-y-2 transition-transform duration-300 border-t-4 border-transparent hover:border-[#0e6add]">
                        <div className="w-16 h-16 bg-blue-50 text-[#0e6add] rounded-full flex items-center justify-center mx-auto mb-6">
                            {/* Icon Bác sĩ/Người */}
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Đội ngũ hàng đầu</h3>
                        <p className="text-gray-500">Quy tụ hàng ngàn bác sĩ giỏi, chuyên gia y tế đến từ các bệnh viện và phòng khám uy tín.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}