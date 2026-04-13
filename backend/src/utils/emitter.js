// Emitter quản lý phát (emit) sự kiện qua Socket.IO

class Emitter {
  setIO(io) {
    this.io = io;
  }

  // Emit cho tất cả client của bác sĩ (overview queue)
  emitToDoctor(doctorId, data) {
    if (!this.io) return;

    this.io.to(`doctor-${doctorId}`).emit("queue:update", data);
  }

  // Emit cho 1 user cụ thể (cá nhân hóa)
  emitToUser(userId, data) {
    if (!this.io) return;

    this.io.to(`user-${userId}`).emit("queue:update", data);
  }
}

module.exports = new Emitter();