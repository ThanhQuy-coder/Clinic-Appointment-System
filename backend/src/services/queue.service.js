const redis = require("../config/redis.js");

class QueueService {
  getKey(doctorId) {
    return `queue:doctor:${doctorId}`;
  }

  // Thêm vào queue
  async addToQueue({ doctorId, patientId }) {
    const key = this.getKey(doctorId);

    const score = Date.now(); // FIFO

    await redis.zadd(
      key,
      score,
      JSON.stringify({
        patientId,
        status: "WAITING",
      }),
    );

    return this.getQueueState(doctorId);
  }

  // Next patient
  async handleNext(doctorId) {
    const key = this.getKey(doctorId);

    // Lấy toàn bộ queue
    const items = await redis.zrange(key, 0, -1);

    let parsed = items.map((i) => JSON.parse(i));

    // DONE current
    const current = parsed.find((q) => q.status === "IN_PROGRESS");
    if (current) current.status = "DONE";

    // NEXT
    const next = parsed.find((q) => q.status === "WAITING");
    if (next) next.status = "IN_PROGRESS";

    // Ghi lại Redis (overwrite)
    await redis.del(key);

    for (let i = 0; i < parsed.length; i++) {
      await redis.zadd(key, i, JSON.stringify(parsed[i]));
    }

    return this.buildResponse(parsed);
  }

  // Remove
  async removeFromQueue({ doctorId, patientId }) {
    const key = this.getKey(doctorId);

    const items = await redis.zrange(key, 0, -1);
    const filtered = items
      .map((i) => JSON.parse(i))
      .filter((q) => q.patientId !== patientId);

    await redis.del(key);

    for (let i = 0; i < filtered.length; i++) {
      await redis.zadd(key, i, JSON.stringify(filtered[i]));
    }

    return this.buildResponse(filtered);
  }

  async getQueueState(doctorId) {
    const key = this.getKey(doctorId);

    const items = await redis.zrange(key, 0, -1);
    const parsed = items.map((i) => JSON.parse(i));

    return this.buildResponse(parsed);
  }

  buildResponse(queue) {
    const waiting = queue.filter((q) => q.status === "WAITING");

    return {
      queue,
      remaining: waiting.length,
    };
  }
}

module.exports = new QueueService();
