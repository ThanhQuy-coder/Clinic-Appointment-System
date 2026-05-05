# 1. Hướng dẫn chạy dự án

> Cập nhật: 05/05/2026

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

Nhớ những thông tin quan trọng sau để còn điền vào `.env`:

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

### Bước 4: Tạo các bảng trong database tự động bằng Sequelize CLI

```bash
# Nếu chưa truy cập
cd backend

# Lệnh chạy các migrate đã được thiết lập
# - Nó sẽ tự động tạo các bảng database như: users, doctors
npx sequelize-cli db:migrate
```

> Từ khóa công nghệ này là `Sequelize`, Tổng hợp lệnh có thể tham khảo ở bên dưới

### Bước 5: Chạy Redis bằng docker để sử dụng chức năng Queue-realtime

1. Đã cài đặt docker
2. Khởi chạy docker và chạy lệnh sau:

```bash
# Đây là lệnh tạo container redis
docker run -d --name redis -p 6379:6379 redis
```

3. Cấu hình tiếp tục file `.env` trong `backend` như sau:

```bash
# Thêm 2 biến sau vào cuối file
# ioredis (Có thể copy luôn vì không phải key quan trọng)
IOREDIS_HOST=127.0.0.1
IOREDIS_PORT=6379
```

> Như vậy thì đã chạy được, khi chạy dự án lại thì chỉ cần mở docker và chạy container redis là xong 
> ---
> Nếu muốn tìm hiểu sâu chức năng này từ khóa là `bullMQ + Redis`

### Bước 6: Chạy dự án (Hoàn thành)

```bash
# Chạy backend (Đây là chạy dev mode nếu chạy bình thường thì đổi `dev` thành `start`)
npm run dev
```

# 2. Danh sách các dependencies + dev dependencies trong backend

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

# 3. Các lệnh Sequelize cơ bản

## 1. Lệnh Khởi tạo dự án Sequelize

| Lệnh                              | Mô tả                                                             |
| --------------------------------- | ----------------------------------------------------------------- |
| npx sequelize-cli init            | "Khởi tạo toàn bộ cấu trúc (config, models, migrations, seeders)" |
| npx sequelize-cli init:models     | Chỉ tạo thư mục models                                            |
| npx sequelize-cli init:config     | Chỉ tạo thư mục config                                            |
| npx sequelize-cli init:migrations | Chỉ tạo thư mục migrations                                        |

## 2. Lệnh Migration (Quan trọng)

| Lệnh                                                     | Mô tả                                     |
| -------------------------------------------------------- | ----------------------------------------- |
| npx sequelize-cli db:migrate:status                      | Xem trạng thái tất cả migration (up/down) |
| npx sequelize-cli db:migrate                             | Chạy tất cả migration chưa chạy           |
| npx sequelize-cli db:migrate --name tên-file.js          | Chạy chỉ một migration cụ thể             |
| npx sequelize-cli db:migrate:undo                        | Hoàn tác (rollback) migration cuối cùng   |
| npx sequelize-cli db:migrate:undo --name tên-file.js     | Hoàn tác một migration cụ thể             |
| npx sequelize-cli db:migrate:undo:all                    | Hoàn tác tất cả migration (xóa hết bảng)  |
| npx sequelize-cli migration:generate --name create-users | Tạo file migration mới                    |

## 3. Seeder (Dữ liệu mẫu)

| Lệnh                                              | Mô tả                  |
| ------------------------------------------------- | ---------------------- |
| npx sequelize-cli seed:generate --name demo-users | Tạo file seeder mới    |
| npx sequelize-cli db:seed:all                     | Chạy tất cả seeder     |
| npx sequelize-cli db:seed --seed tên-file.js      | Chạy một seeder cụ thể |
| npx sequelize-cli db:seed:undo                    | Hoàn tác seeder cuối   |
| npx sequelize-cli db:seed:undo:all                | Hoàn tác tất cả seeder |
