# Backend - Clinic Appointment System

Backend cung cấp **REST API**, **Socket.IO realtime**, và **BullMQ workers** (Redis) để xử lý hàng đợi khám + thông báo.

## Chạy nhanh

### 1) Cài dependencies

```bash
cd backend
npm install
```

### 2) Tạo `backend/.env`

Xem chi tiết `SETUP.md`. Tối thiểu cần:

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

### 3) Migrate database

```bash
cd backend
npx sequelize-cli db:migrate
```

### 4) Chạy server

> Entry file hiện tại là `index.js` (không phải `app.js`).

```bash
cd backend
node index.js
```

Server mặc định chạy port `3001`.

## Kiến trúc thư mục (rút gọn)

- `index.js`: khởi tạo Express + HTTP server + Socket.IO + Redis + workers
- `src/routes/`: REST API routes (`/api/...`)
- `src/services/`: business logic (appointments, notification, jwt...)
- `src/models/` + `src/migrations/`: Sequelize models/migrations
- `src/queues/`:
  - `appointment_queue_{doctorId}`: queue theo từng bác sĩ
  - `notification_queue`: queue thông báo (notify/reminder)
- `src/sockets/socketServer.js`: Socket.IO server
- `src/utils/emitter.js`: phát event realtime vào rooms

## Realtime events

### Client join rooms

Client gọi:

- `socket.emit("join", { userId, doctorId })`

Rooms tương ứng:

- `user-{userId}`
- `doctor-{doctorId}`

### Events phát ra

- `user:queue:update`: cập nhật vị trí/ước tính thời gian chờ
- `doctor:queue:update`: cập nhật overview cho bác sĩ
- `user:notification:new`: thông báo realtime (từ `notification_queue`)

## Queue / Notification flow

- Khi appointment được `Confirmed`:
  - add job vào `appointment_queue_{doctorId}`
  - enqueue `APPOINTMENT_CREATED`
  - schedule delayed reminders `APPOINTMENT_REMINDER` (1 ngày / 1 giờ / 15 phút)
- Khi gọi lượt tiếp theo (`queue/next`):
  - update trạng thái queue và emit `user:queue:update`
  - enqueue `APPOINTMENT_TURN`
- Khi hoàn thành (`Completed`) hoặc `NoShow`:
  - enqueue `APPOINTMENT_COMPLETED` hoặc `APPOINTMENT_MISSED`

Files chính:

- `src/queues/queueManager.js`
- `src/services/notification.service.js`
- `src/queues/notificationWorker.js`

## API tham khảo

Base: `http://localhost:3001/api`

- `POST /users/login`
- `POST /users/register`
- `GET /appointments`
- `PATCH /appointments/:id/status`
- `PATCH /appointments/:id/cancel`
- `GET /queue/status?doctorId=...&appointmentId=...`
- `GET /queue/next?doctorId=...`

## Setup chi tiết

Xem `backend/SETUP.md`.

