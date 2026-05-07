import React from 'react';

export default function Home() {
  return (
    <div className="w-full bg-white">
      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-[#0e6add] via-[#1266d9] to-indigo-600 text-white py-16 md:py-20 px-6 lg:px-24 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-indigo-300/20 blur-3xl"></div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center relative z-10">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center rounded-full bg-white/15 px-4 py-1 text-sm font-medium mb-5">
              Nền tảng đặt khám cho bệnh nhân
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Đặt lịch khám nhanh, theo dõi lượt khám dễ dàng
            </h1>
            <p className="text-lg opacity-95 mb-8">
              Chủ động chọn bác sĩ, nhận nhắc lịch đúng lúc và giảm thời gian chờ tại bệnh viện.
            </p>

            <div className="relative max-w-2xl mx-auto md:mx-0 mt-4">
              <input
                type="text"
                placeholder="Tìm bác sĩ, chuyên khoa, phòng khám..."
                className="w-full py-4 pl-6 pr-16 bg-white rounded-full text-gray-900 placeholder-gray-400 shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/40 transition-all duration-300"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-[#0e6add] text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition-all shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            <div className="mt-7 flex flex-wrap gap-3 justify-center md:justify-start">
              <a href="/register" className="bg-white text-[#0e6add] font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
                Đăng ký ngay
              </a>
              <a href="/appointments/book" className="bg-white/15 border border-white/40 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/25 transition-colors">
                Đặt lịch khám
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-white/30 bg-white/10 p-3 backdrop-blur-md shadow-2xl">
              <img
                src="https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Bệnh nhân trao đổi với bác sĩ"
                className="rounded-2xl w-full h-[320px] md:h-[420px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* STATS + BENEFITS */}
      <section className="max-w-7xl mx-auto px-6 lg:px-24 py-14">
        <div className="grid md:grid-cols-3 gap-5 mb-10">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <p className="text-sm text-slate-600">Bác sĩ hợp tác</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">1,000+</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
            <p className="text-sm text-slate-600">Bệnh viện & phòng khám</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">125+</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
            <p className="text-sm text-slate-600">Thông báo nhắc lịch</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">Realtime</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Tiết kiệm thời gian',
              desc: 'Đặt lịch trước, hạn chế xếp hàng và chủ động kế hoạch cá nhân.',
              image: 'https://images.pexels.com/photos/3769151/pexels-photo-3769151.jpeg?auto=compress&cs=tinysrgb&w=900',
            },
            {
              title: 'Minh bạch thông tin',
              desc: 'Xem bác sĩ, chuyên khoa, thời gian khám và trạng thái lịch hẹn rõ ràng.',
              image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=900',
            },
            {
              title: 'Theo dõi hàng đợi',
              desc: 'Nhận cập nhật số thứ tự và thời gian chờ trực tiếp theo thời gian thực.',
              image: 'https://images.pexels.com/photos/7659573/pexels-photo-7659573.jpeg?auto=compress&cs=tinysrgb&w=900',
            },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-slate-100 rounded-2xl shadow-lg overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-44 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-slate-50 py-14 px-6 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">Đặt lịch chỉ với 3 bước</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Tạo tài khoản', desc: 'Đăng ký nhanh bằng email và số điện thoại.' },
              { step: '02', title: 'Chọn bác sĩ & giờ khám', desc: 'Tìm theo chuyên khoa, xem lịch trống theo thời gian thực.' },
              { step: '03', title: 'Nhận nhắc lịch', desc: 'Theo dõi trạng thái khám và nhận thông báo đến lượt.' },
            ].map((item) => (
              <div key={item.step} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-md">
                <p className="text-[#0e6add] text-sm font-bold mb-2">BƯỚC {item.step}</p>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-14 px-6 lg:px-24">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-[#0e6add] to-indigo-600 p-8 md:p-12 text-white text-center shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Sẵn sàng bắt đầu?</h2>
          <p className="text-blue-100 mb-8">Tạo tài khoản để đặt lịch khám nhanh và nhận thông báo nhắc lịch tự động.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/register" className="bg-white text-[#0e6add] font-semibold px-7 py-3 rounded-xl hover:bg-blue-50 transition-colors">
              Tạo tài khoản miễn phí
            </a>
            <a href="/faq" className="bg-white/15 border border-white/40 text-white font-semibold px-7 py-3 rounded-xl hover:bg-white/25 transition-colors">
              Xem hướng dẫn sử dụng
            </a>
          </div>
        </div>
      </section>
      </div>
  );
}