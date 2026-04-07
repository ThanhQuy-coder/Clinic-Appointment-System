import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'Hệ thống đặt lịch khám bệnh',
  description: 'Đặt lịch khám bệnh trực tuyến nhanh chóng, dễ dàng',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="bg-white min-h-screen">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}