import React from 'react';

export default function Home() {
  return (
    <div className="w-full">
      {/* HERO SECTION MÀU XANH */}
      <div className="bg-[#0e6add] text-white py-20 px-8 lg:px-24 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">

        {/* Phần nội dung bên trái */}
        <div className="w-full md:w-3/5 z-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Ứng dụng đặt khám
          </h1>
          <p className="text-lg mb-8 opacity-90">
            Đặt khám với hơn 1000 bác sĩ, 25 bệnh viện, 100 phòng khám trên hệ thống <br className="hidden md:block" />
            để có số thứ tự và khung giờ khám trước.
          </p>

          {/* Thanh Search Bar bo tròn */}
          {/* Thanh Search Bar bo tròn NỔI BẬT */}
          <div className="relative max-w-2xl mx-auto md:mx-0 mt-8 group">
            <input
              type="text"
              placeholder="Triệu chứng, bác sĩ, bệnh viện..."
              className="w-full py-4 pl-8 pr-16 bg-white rounded-full text-gray-900 placeholder-gray-400 shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/40 transition-all duration-300 focus:scale-[1.02]"
            />
            {/* Nút kính lúp được làm thành hình tròn nổi bật */}
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-[#0e6add] text-white rounded-full flex items-center justify-center hover:bg-blue-800 hover:scale-105 transition-all shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Phần ảnh bên phải (Tạm thời để khung trống, sau này chèn ảnh gia đình vào) */}
        <div className="hidden md:flex w-full md:w-2/5 justify-end z-10 mt-10 md:mt-0 relative">
          <div className="bg-blue-800/20 w-[400px] h-[400px] rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30 shadow-2xl">
            <p className="text-white font-medium">(Chèn ảnh gia đình vào đây)</p>
          </div>
        </div>
      </div>

      {/* SECTION BÊN DƯỚI */}
      <div className="bg-white py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Đặt lịch khám trực tuyến</h2>
        <p className="text-gray-500">Tìm Bác sĩ chính xác - Đặt lịch khám dễ dàng</p>
      </div>
    </div>
  );
} 