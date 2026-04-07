'use client';

import React, { useState } from 'react';

export default function FAQ() {
    // Trạng thái lưu xem câu hỏi nào đang được mở (null nghĩa là đang đóng hết)
    const [openIndex, setOpenIndex] = useState(null);

    // Hàm xử lý khi bấm vào một câu hỏi
    const toggleFAQ = (index) => {
        // Nếu bấm lại vào câu đang mở thì đóng nó lại, nếu không thì mở câu mới
        setOpenIndex(openIndex === index ? null : index);
    };

    // Danh sách các câu hỏi thường gặp (Mock data)
    const faqs = [
        {
            question: "Làm thế nào để đặt lịch khám bệnh trên hệ thống?",
            answer: "Bạn chỉ cần đăng nhập vào tài khoản, tìm kiếm bác sĩ hoặc chuyên khoa mong muốn, chọn ngày giờ phù hợp có sẵn và xác nhận. Một tin nhắn SMS hoặc Email sẽ được gửi đến bạn để xác nhận lịch hẹn thành công."
        },
        {
            question: "Tôi có thể hủy hoặc dời lịch khám đã đặt không?",
            answer: "Hoàn toàn được. Bạn có thể truy cập vào mục 'Lịch hẹn của tôi', chọn lịch hẹn cần thay đổi và bấm 'Hủy' hoặc 'Dời lịch'. Lưu ý: Vui lòng thực hiện thao tác này ít nhất 12 tiếng trước giờ khám dự kiến để hệ thống sắp xếp chỗ cho bệnh nhân khác."
        },
        {
            question: "Việc thanh toán chi phí khám bệnh diễn ra như thế nào?",
            answer: "Bạn có thể thanh toán trực tuyến qua cổng thanh toán VNPay, Momo, thẻ tín dụng ngay lúc đặt lịch, hoặc chọn hình thức 'Thanh toán tại cơ sở y tế' khi đến khám trực tiếp."
        },
        {
            question: "Tôi cần đến trước giờ khám bao lâu?",
            answer: "Bạn nên có mặt tại phòng khám hoặc bệnh viện ít nhất 15-20 phút trước giờ hẹn để làm thủ tục check-in tại quầy lễ tân và chuẩn bị tâm lý thoải mái nhất trước khi gặp bác sĩ."
        },
        {
            question: "Thông tin bệnh án cá nhân của tôi có được bảo mật không?",
            answer: "Chúng tôi cam kết bảo mật tuyệt đối thông tin y tế của bạn theo tiêu chuẩn bảo mật dữ liệu cấp cao. Chỉ có bạn và bác sĩ trực tiếp điều trị mới có quyền truy cập vào hồ sơ bệnh án này."
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen py-16">
            <div className="max-w-4xl mx-auto px-8">

                {/* Phần Tiêu đề */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-[#0e6add] mb-4">Trợ giúp & Câu hỏi thường gặp</h1>
                    <p className="text-gray-600 text-lg">
                        Tìm câu trả lời nhanh chóng cho các thắc mắc phổ biến về dịch vụ đặt lịch khám.
                    </p>
                </div>

                {/* Khung chứa danh sách Accordion */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm
                ${openIndex === index ? 'border-[#0e6add]' : 'border-gray-200 hover:border-blue-300'}
              `}
                        >
                            {/* Phần Câu hỏi (Clickable) */}
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                            >
                                <h3 className={`text-lg font-medium transition-colors duration-300 ${openIndex === index ? 'text-[#0e6add]' : 'text-gray-800'}`}>
                                    {faq.question}
                                </h3>

                                {/* Icon Dấu + / Dấu - */}
                                <div className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${openIndex === index ? 'bg-[#0e6add] text-white rotate-180' : 'bg-gray-100 text-gray-500'}`}>
                                    {openIndex === index ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                    )}
                                </div>
                            </button>

                            {/* Phần Câu trả lời (Sẽ mở ra khi openIndex === index) */}
                            <div
                                className={`transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100 pb-6 px-6' : 'max-h-0 opacity-0 px-6'
                                    }`}
                            >
                                <div className="w-full h-px bg-gray-100 mb-4"></div>
                                <p className="text-gray-600 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Khung liên hệ thêm */}
                <div className="mt-12 text-center p-8 bg-blue-50 rounded-2xl border border-blue-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Bạn vẫn cần hỗ trợ?</h3>
                    <p className="text-gray-600 mb-6">Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng lắng nghe bạn.</p>
                    <a href="/contact" className="inline-block bg-[#0e6add] text-white font-medium px-8 py-3 rounded-full hover:bg-blue-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                        Gửi yêu cầu hỗ trợ
                    </a>
                </div>

            </div>
        </div>
    );
}