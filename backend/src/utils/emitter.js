// Emitter quản lý phát (emit) sự kiện qua Socket.IO

class Emitter {
  setIO(io) {
    this.io = io;
  }

  // Emit cho tất cả client của bác sĩ (overview queue)
  emitToDoctor(doctorId, data) {
    if (!this.io) return;
    // console.log(`doctor-${doctorId}: data ${data}`);

    this.io.to(`doctor-${doctorId}`).emit("doctor:queue:update", data);
  }

  // Emit cho 1 user cụ thể (cá nhân hóa)
  emitToUser(userId, data) {
    if (!this.io) return;

    // console.log(`user-${userId}: data ${data}`);
    this.io.to(`user-${userId}`).emit("user:queue:update", data);
  }

  // Emit thông báo realtime cho 1 user cụ thể
  emitNotificationToUser(userId, data) {
    if (!this.io) return;
    this.io.to(`user-${userId}`).emit("user:notification:new", data);
  }
}

module.exports = new Emitter();
