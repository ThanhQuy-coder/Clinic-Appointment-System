const express = require("express");
const router = express.Router();
const QueueController = require("../controllers/queue.controller.js");
const { authenticate } = require('../middlewares/auth.middleware.js');
const { authorize } = require('../middlewares/role.middleware.js');
const queueController = require("../controllers/queue.controller.js");

// ==== API test ====
router.get("/next", queueController.next);

router.post("/complete", queueController.complete);

router.get("/current", queueController.current);

router.post("/add", queueController.add);
// =====

// GET: queue/status (Doctor và Patient)
router.get("/status", queueController.queueStatus);

module.exports = router;