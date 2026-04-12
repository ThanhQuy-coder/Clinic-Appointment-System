const express = require("express");
const router = express.Router();
const QueueController = require("../controllers/queue.controller.js");
const { authenticate } = require('../middlewares/auth.middleware.js');
const { authorize } = require('../middlewares/role.middleware.js');

// api: /queue/next
router.post("/next", authenticate, authorize("Doctor"), QueueController.next);

// ! api: /queue-status
// Cần thêm authenticate
router.get("/queue-status", QueueController.getQueueStatus);

module.exports = router;