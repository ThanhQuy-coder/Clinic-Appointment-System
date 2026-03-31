const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const { sequelize } = require("./src/models/index.js");
const routes = require("./src/routes/index.js");
const { errorHandler, notFoundHandler } = require("./src/middlewares/error.middleware.js");

const app = express();
const PORT = process.env.PORT || 3000;

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

// Kiểm tra kết nối với DB
sequelize
  .authenticate()
  .then(() => {
    console.log("Connect database success");
  })
  .catch((err) => {
    console.error("Error connect database: ", err);
  });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
