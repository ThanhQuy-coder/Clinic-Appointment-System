const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const { sequelize } = require("./src/models/index.js");
const routes = require("./src/routes/index.js");
const {
  errorHandler,
  notFoundHandler,
} = require("./src/middlewares/error.middleware.js");
const http = require("http");
const socketServer = require("./src/sockets/socketServer.js");
require("./src/queues/notificationWorker");
// const { replayAppointments } = require("./src/scripts/replayAppointmentsToQueue.js");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware cơ bản
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

// Routes
app.use("/api", routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Kết nối redis
const redis = require("./src/config/redis.js");

// Khởi tạo socketServer
const server = http.createServer(app);
socketServer.init(server);

// Kiểm tra kết nối với DB
sequelize
  .authenticate()
  .then(() => {
    console.log("Connect database success");
  })
  .catch((err) => {
    console.error("Error connect database: ", err);
  });

// Kiểm tra kết nối IORedis
if (redis) {
  redis.on("connect", () => {
    console.log("Redis connected");
  });
  redis.on("error", (err) => {
    console.error("Redis error:", err);
  });
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
