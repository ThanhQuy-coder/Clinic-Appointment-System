'use client'; // Dòng này cực kỳ quan trọng trong Next.js để sử dụng được các hiệu ứng cuộn/click

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Navbar = () => {
    // Biến state để lưu trạng thái xem đã cuộn chuột hay chưa
    const [isScrolled, setIsScrolled] = useState(false);

    // Hàm theo dõi sự kiện cuộn chuột
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            // Dùng 'sticky top-0' để thanh này luôn bám dính ở trên cùng
            // Dùng toán tử 3 ngôi (isScrolled ? ... : ...) để đổi màu nền khi cuộn
            className={`sticky top-0 z-50 flex items-center justify-between px-8 transition-all duration-300 text-black
        ${isScrolled
                    ? 'py-3 bg-white/70 backdrop-blur-md shadow-md' // Khi cuộn: Trong suốt 70% + Làm mờ (Kính) + Thu nhỏ padding
                    : 'py-4 bg-white shadow-sm' // Khi ở trên cùng: Nền trắng đặc + Padding to hơn
                }
      `}
        >
            {/* Cụm Logo */}
            <div className="flex items-center">
                <Link href="/" className="text-3xl font-bold text-[#0e6add]">
                    Hệ thống đặt lịch
                </Link>
            </div>

            {/* Menu chính ở giữa */}
            <div className="hidden md:flex items-center space-x-8 font-medium">
                <Link href="/" className="hover:text-[#0e6add] transition-colors">Trang chủ</Link>
                <Link href="/about" className="hover:text-[#0e6add] transition-colors">Giới thiệu</Link>
                <Link href="/faq" className="hover:text-[#0e6add] transition-colors">Trợ giúp</Link>
                <Link href="/contact" className="hover:text-[#0e6add] transition-colors">Liên hệ</Link>
            </div>

            {/* Nút Đăng nhập bên phải */}
            {/* Cụm nút Đăng ký & Đăng nhập bên phải */}
            <div className="flex items-center space-x-2">
                <Link
                    href="/register"
                    className="px-4 py-2 text-gray-600 font-medium hidden sm:block rounded-full hover:bg-blue-50 hover:text-[#0e6add] active:scale-95 transition-all duration-300"
                >
                    Đăng ký
                </Link>
                <Link
                    href="/login"
                    className="px-6 py-2 text-[#0e6add] font-medium border-2 border-[#0e6add] rounded-full hover:bg-[#0e6add] hover:text-white hover:shadow-[0_8px_15px_rgba(14,106,221,0.3)] hover:-translate-y-0.5 active:scale-95 active:translate-y-0 transition-all duration-300"
                >
                    Đăng nhập
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;