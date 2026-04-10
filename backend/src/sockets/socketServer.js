const { Server } = require("socket.io");
const emitter = require("../utils/emitter");

class SocketServer {
  init(server) {
    // Khởi tạo Socket.IO server và gắn vào HTTP server
    this.io = new Server(server, {
      cors: { origin: "*" },
      methods: ["GET", "POST"]
    });

    // Truyền socket server vào emitter để các service khác có thể phát realtime
    emitter.setIO(this.io);

    // Lắng nghe sự kiện kết nối từ client
    this.io.on("connection", (socket) => {
      console.log("Client connected", socket.id);

      /**
       * Khi client join, gán socket vào các room:
       * - doctor-{doctorId}: room riêng cho bác sĩ, để nhận cập nhật queue
       * - user-{userId}: room riêng cho bệnh nhân/người dùng, để nhận thông báo cá nhân
       */
      socket.on("join", ({ doctorId, userId }) => {
        if (doctorId) socket.join(`doctor-${doctorId}`);
        if (userId) socket.join(`user-${userId}`);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });

    console.log("Init Socket.IO complete!");
  }
}

module.exports = new SocketServer();
