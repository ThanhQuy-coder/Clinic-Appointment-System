const redis = require("../config/redis.js");

class QueueService {
  getWaitingKey(doctorId) {
    return `queue:doctor:${doctorId}:waiting`;
  }

  getActiveKey(doctorId) {
    return `queue:doctor:${doctorId}:active`;
  }

  /**
   * THÊM VÀO HÀNG ĐỢI
   */
  async addToQueue({ doctorId, patientId }) {
    const waitingKey = this.getWaitingKey(doctorId);
    const score = Date.now();

    const patientData = JSON.stringify({
      patientId,
      status: "Confirmed",
      createdAt: score,
    });

    // Thêm trực tiếp vào Sorted Set, không cần đọc ra/ghi lại
    await redis.zadd(waitingKey, score, patientData);

    return this.getQueueState(doctorId);
  }

  /**
   * CHUYỂN BỆNH NHÂN TIẾP THEO
   */
  async handleNext(doctorId) {
    const waitingKey = this.getWaitingKey(doctorId);
    const activeKey = this.getActiveKey(doctorId);

    const nextItems = await redis.zrange(waitingKey, 0, 0);

    if (nextItems.length === 0) {
      // Nếu hàng đợi trống, xóa bệnh nhân đang khám cũ (nếu có)
      await redis.del(activeKey);
      return this.getQueueState(doctorId);
    }

    const patientRaw = nextItems[0];
    const patientData = JSON.parse(patientRaw);
    patientData.status = "InProgress";

    const multi = redis.multi();

    multi.zrem(waitingKey, patientRaw);

    multi.set(activeKey, JSON.stringify(patientData));

    await multi.exec();

    return this.getQueueState(doctorId);
  }

  /**
   * XÓA BỆNH NHÂN KHỎI HÀNG ĐỢI
   */
  async removeFromQueue({ doctorId, patientId }) {
    const waitingKey = this.getWaitingKey(doctorId);

    // Tìm phần tử có patientId tương ứng trong Sorted Set
    const items = await redis.zrange(waitingKey, 0, -1);
    const targetMember = items.find(
      (i) => JSON.parse(i).patientId === patientId,
    );

    if (targetMember) {
      // Chỉ xóa duy nhất phần tử đó, O(log(N)) thay vì xóa cả List
      await redis.zrem(waitingKey, targetMember);
    }

    return this.getQueueState(doctorId);
  }

  /**
   * LẤY TRẠNG THÁI HIỆN TẠI
   */
  async getQueueState(doctorId) {
    const waitingKey = this.getWaitingKey(doctorId);
    const activeKey = this.getActiveKey(doctorId);

    // Lấy song song cả danh sách chờ và người đang khám
    const [waitingItems, activeItem] = await Promise.all([
      redis.zrange(waitingKey, 0, -1),
      redis.get(activeKey),
    ]);

    const waitingList = waitingItems.map((i) => JSON.parse(i));
    const current = activeItem ? JSON.parse(activeItem) : null;

    return {
      current,
      waiting: waitingList,
      totalWaiting: waitingList.length,
    };
  }
}

module.exports = new QueueService();
