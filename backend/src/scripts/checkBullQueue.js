const { Queue } = require("bullmq");

// 1. Cấu hình kết nối Redis riêng biệt
const connection = {
  host: "127.0.0.1",
  port: 6379,
};

// 2. Khởi tạo Queue
const appointmentQueue = new Queue("appointment-queue", { connection });

async function checkBullQueue() {
  try {
    console.log("--- BẮT ĐẦU KIỂM TRA HÀNG ĐỢI ---");

    // 1. Thống kê tổng số lượng theo trạng thái
    const counts = await appointmentQueue.getJobCounts();
    console.log("Thống kê số lượng:", JSON.stringify(counts, null, 2));

    // 2. Lấy danh sách các Job đang chờ (Waiting)
    // getWaiting() của BullMQ trả về một mảng các đối tượng Job
    const waitingJobs = await appointmentQueue.getJobs(['waiting']);
    console.log(`\nDanh sách đang chờ (${waitingJobs.length}):`);
    waitingJobs.forEach(job => {
      console.log(`- ID: ${job.id} | Bệnh nhân: ${job.data.patientId} | Bác sĩ: ${job.data.doctorId}`);
    });

    // 3. Lấy các Job đang thực hiện (Active)
    const activeJobs = await appointmentQueue.getJobs(['active']);
    console.log(`\nĐang khám (${activeJobs.length}):`);
    activeJobs.forEach(job => {
      console.log(`- ID: ${job.id} | Bệnh nhân: ${job.data.patientId} | Bác sĩ: ${job.data.doctorId}`);
    });

    console.log("\n--- KIỂM TRA HOÀN TẤT ---");
  } catch (error) {
    console.error("Lỗi khi kiểm tra hàng đợi:", error);
  } finally {
    // Đóng kết nối để script có thể kết thúc
    await appointmentQueue.close();
  }
}

checkBullQueue();