# Frontend - Clinic Appointment System

Frontend là ứng dụng Next.js (App Router) phục vụ UI cho bệnh nhân và trang quản trị, tích hợp:

- REST API qua Axios (`src/lib/axios.js`)
- Realtime qua Socket.IO client (queue + notifications)
- TailwindCSS + Lucide icons

## Chạy dự án

```bash
cd frontend
npm install
npm run dev
```

Mặc định chạy ở `http://localhost:3000`.

## Biến môi trường

Tạo file `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_URL_SOCKET=http://localhost:3001
```

## Các trang chính (tham khảo)

- `/` (Home)
- `/login`, `/register`
- `/appointments` (danh sách lịch hẹn)
- `/live-queue` (theo dõi hàng đợi realtime)
- `/about`, `/contact`, `/faq`

## Realtime

### Queue realtime

Trang `live-queue` kết nối socket và join:

```js
socket.emit("join", { userId, doctorId })
```

Lắng nghe:

- `user:queue:update`

### Notifications realtime

Navbar lắng nghe:

- `user:notification:new`

## Lint

```bash
cd frontend
npm run lint
```

