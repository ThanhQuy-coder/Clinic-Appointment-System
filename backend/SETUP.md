# Hướng dẫn chạy dự án

### Bước 1: Cài đặt cần thiết

> Yêu cầu đã cài đặt MySQL và Nodejs

```bash
#  Từ thư mục root truy cập vào thư mục backend
cd backend

#  Tải các dependencies cần thiết
npm install
```

### Bước 2: Tạo Database trong MySQL

Có nhiều cách tạo Database trong MySQL:

1. MySQL Command Line
2. MySQL Workbench (Khuyến khích)
3. (Vân vân)

> Rất dễ nên tự tìm hiểu nha

Nhớ nhưng thông tin quan trong sau để còn điền vào `.env`:

- Username: tên người dùng. Mặc định là `root` hoặc tên tài khoản riêng.
- Password: mật khẩu nếu sử dụng tài khoản riêng (nếu không có thì bỏ qua).
- Host: máy chủ hoặc địa chỉ cơ sở dữ liệu đang chạy.
  - 127.0.0.1 hoặc localhost → nghĩa là MySQL chạy ngay trên máy của bạn.
  - 192.168.x.x → kết nối tới một máy trong mạng LAN.
  - db.example.com → kết nối tới server MySQL trên internet.
- Database name: Tên cơ sở dữ liệu mình đã tạo
- Port: cổng mà cơ sở dữ liệu đang chạy

### Bước 3: Thiết lập file .env

- Khởi tạo file `.env` ở thư mục root của `backend` => tương ứng `backend/.env`
- Điền thông tin theo mẫu `.env.example`

#### Ví dụ

```bash
# Database
CLINIC_DB_HOST=127.0.0.1
CLINIC_DB_USER=huynhthanhquy
CLINIC_DB_PASS=123
CLINIC_DB_NAME=clinic
CLINIC_DB_PORT=3306
```

### Bước 4: Chạy dự án (Hoàn thành)

```bash
# Chạy backend (Đây là chạy dev mode nếu chạy bình thường thì đổi `dev` thành `start`)
npm run dev
```

# Danh sách các dependencies + dev dependencies

| Package       | Mục đích                                                                            |
| ------------- | ----------------------------------------------------------------------------------- |
| express       | Framework chính                                                                     |
| cors          | Cho phép frontend gọi API                                                           |
| dotenv        | Load biến môi trường từ file .env                                                   |
| helmet        | Bảo mật HTTP headers                                                                |
| morgan        | Log request (dev + production)                                                      |
| compression   | Nén response (gzip)                                                                 |
| nodemon       | Tự động restart server khi code thay đổi                                            |
| concurrently  | Chạy nhiều lệnh cùng lúc (nếu dùng với frontend)                                    |
| sequelize     | Thư viện ORM Cho phép bạn thao tác với Database thông qua các đối tượng JavaScript. |
| mysql2        | Dùng để kết nối với MySQL                                                           |
| sequelize-cli | Dùng để tạo migrate cơ sở dữ liệu, seed dữ liệu, v.v.                               |
