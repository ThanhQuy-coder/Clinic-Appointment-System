# Clinic Appointment System

Hệ thống đặt lịch khám bệnh (Patient/Doctor/Admin) với **queue realtime** và **notification realtime** (BullMQ + Redis + Socket.IO).

![Clinic Appointment System Banner](https://static.vecteezy.com/system/resources/previews/016/928/590/non_2x/online-doctor-appointment-system-flat-banner-template-telehealth-services-iot-poster-leaflet-printable-color-designs-editable-flyer-page-with-text-space-vector.jpg)

## Tổng quan

- **Frontend**: Next.js (App Router) + TailwindCSS
- **Backend**: Node.js + Express + Sequelize (MySQL)
- **Realtime**: Socket.IO
- **Queue/Jobs**: BullMQ + Redis
- **Auth**: JWT

Repo gồm 2 phần:

- `backend/`: REST API + Socket.IO server + BullMQ workers
- `frontend/`: UI cho bệnh nhân và trang quản trị

## Tính năng nổi bật

- **Đặt lịch khám** theo bác sĩ/khung giờ
- **Theo dõi hàng đợi realtime** (trang `live-queue`)
- **Thông báo realtime** cho người dùng (navbar)
- **Nhắc lịch tự động** bằng delayed jobs (BullMQ delay)

## Chạy dự án (Local)

### Yêu cầu

- Node.js (khuyến nghị LTS)
- MySQL
- Redis (khuyến nghị chạy Docker)

### 1) Backend

Xem hướng dẫn chi tiết: `backend/SETUP.md`

Tóm tắt nhanh:

```bash
cd backend
npm install
```

Tạo file `backend/.env` (xem mục “Biến môi trường” bên dưới), chạy migrate:

```bash
cd backend
npx sequelize-cli db:migrate
```

Chạy backend:

```bash
cd backend
node index.js
```

Mặc định backend chạy ở `http://localhost:3001`.

### 2) Redis (BullMQ)

```bash
docker run -d --name redis -p 6379:6379 redis
```

### 3) Frontend

```bash
cd frontend
npm install
npm run dev
```

Mặc định frontend chạy ở `http://localhost:3000`.

## Biến môi trường

### Backend (`backend/.env`)

```bash
# MySQL
CLINIC_DB_HOST=127.0.0.1
CLINIC_DB_USER=root
CLINIC_DB_PASS=
CLINIC_DB_NAME=clinic
CLINIC_DB_PORT=3306

# Redis (BullMQ)
IOREDIS_HOST=127.0.0.1
IOREDIS_PORT=6379
```

### Frontend (`frontend/.env.local`)

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_URL_SOCKET=http://localhost:3001
```

## Realtime queue hoạt động thế nào?

- Client (frontend) kết nối Socket.IO và `join` room:
  - `user-{userId}`: nhận `user:queue:update`, `user:notification:new`
  - `doctor-{doctorId}`: nhận `doctor:queue:update`
- Backend phát event qua `backend/src/utils/emitter.js`
- Queue flow nằm ở `backend/src/queues/queueManager.js`

## Tài liệu theo module

- Backend: xem `backend/README.md` và `backend/SETUP.md`
- Frontend: xem `frontend/README.md`

