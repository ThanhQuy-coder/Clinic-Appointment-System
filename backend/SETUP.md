# Hướng dẫn chạy dự án

```bash
#  Từ thư mục root truy cập vào thư mục backend
cd backend

#  Tải các dependencies cần thiết
npm install

# Chạy backend (Đây là chạy dev mode nếu chạy bình thường thì đổi `dev` thành `start`)
npm run dev
```

# Danh sách các dependencies + dev dependencies

| Package      | Mục đích                                         |
| ------------ | ------------------------------------------------ |
| express      | Framework chính                                  |
| cors         | Cho phép frontend gọi API                        |
| dotenv       | Load biến môi trường từ file .env                |
| helmet       | Bảo mật HTTP headers                             |
| morgan       | Log request (dev + production)                   |
| compression  | Nén response (gzip)                              |
| nodemon      | Tự động restart server khi code thay đổi         |
| concurrently | Chạy nhiều lệnh cùng lúc (nếu dùng với frontend) |
