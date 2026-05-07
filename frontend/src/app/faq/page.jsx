'use client';

import React, { useState } from 'react';

export default function FAQ() {
    // Trạng thái lưu xem câu hỏi nào đang được mở (null nghĩa là đang đóng hết)
    const [openIndex, setOpenIndex] = useState(null);
    const [query, setQuery] = useState('');

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

    const filteredFaqs = faqs.filter((f) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
            f.question.toLowerCase().includes(q) ||
            f.answer.toLowerCase().includes(q)
        );
    });

    return (
        <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen py-14">
            <div className="max-w-5xl mx-auto px-5 md:px-8">

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 text-blue-700 px-3 py-1 text-sm mb-4">
                        Trung tâm trợ giúp
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Trợ giúp & Câu hỏi thường gặp</h1>
                    <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto">
                        Tìm câu trả lời nhanh chóng cho các thắc mắc phổ biến về đặt lịch khám và trải nghiệm bệnh nhân.
                    </p>
                </div>

                {/* Search */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-4 md:p-5 mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Tìm kiếm</label>
                    <div className="flex items-center gap-3">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Nhập từ khóa: đặt lịch, hủy, thanh toán, bảo mật..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0e6add]/30 focus:border-[#0e6add] outline-none transition-all"
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={() => setQuery('')}
                                className="px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium"
                            >
                                Xóa
                            </button>
                        )}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Mẹo: bạn có thể tìm theo câu hỏi hoặc nội dung trả lời.</p>
                </div>

                {/* Khung chứa danh sách Accordion */}
                <div className="space-y-4">
                    {filteredFaqs.length === 0 && (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-8 text-center">
                            <p className="text-slate-700 font-semibold">Không tìm thấy câu trả lời phù hợp</p>
                            <p className="text-slate-500 mt-2">Hãy thử từ khóa khác hoặc gửi yêu cầu hỗ trợ.</p>
                            <a href="/contact" className="inline-flex mt-5 bg-[#0e6add] text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
                                Liên hệ hỗ trợ
                            </a>
                        </div>
                    )}
                    {filteredFaqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden shadow-lg
                ${openIndex === index ? 'border-[#0e6add]' : 'border-slate-100 hover:border-blue-200'}
              `}
                        >
                            {/* Phần Câu hỏi (Clickable) */}
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-5 md:px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                            >
                                <h3 className={`text-base md:text-lg font-semibold transition-colors duration-300 ${openIndex === index ? 'text-[#0e6add]' : 'text-slate-900'}`}>
                                    {faq.question}
                                </h3>

                                {/* Icon Dấu + / Dấu - */}
                                <div className={`flex-shrink-0 ml-4 w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-300 ${openIndex === index ? 'bg-[#0e6add] text-white rotate-180' : 'bg-slate-100 text-slate-500'}`}>
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
                                <div className="w-full h-px bg-slate-100 mb-4"></div>
                                <p className="text-slate-600 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Khung liên hệ thêm */}
                <div className="mt-10 text-center p-8 bg-white rounded-2xl border border-slate-100 shadow-lg">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Bạn vẫn cần hỗ trợ?</h3>
                    <p className="text-slate-600 mb-6">Gửi yêu cầu, chúng tôi sẽ phản hồi sớm nhất có thể.</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a href="/contact" className="inline-flex items-center justify-center bg-[#0e6add] text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all duration-300">
                            Gửi yêu cầu hỗ trợ
                        </a>
                        <a href="/" className="inline-flex items-center justify-center bg-slate-100 text-slate-800 font-semibold px-8 py-3 rounded-xl hover:bg-slate-200 transition-colors">
                            Về trang chủ
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
}