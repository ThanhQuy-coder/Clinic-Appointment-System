// Emitter quản lý phát (emit) sự kiện qua Socket.IO

class Emitter {
  // Gắn đối tượng io vào Emitter
  setIO(io) {
    this.io = io;
  }

  // Phát sự kiện cập nhật hàng đợi cho bác sĩ cụ thể
  emitQueueUpdate(doctorId, data) {
    if (!this.io) return;

    this.io.to(`doctor-${doctorId}`).emit("queue:update", data);
  }
}

module.exports = new Emitter();
