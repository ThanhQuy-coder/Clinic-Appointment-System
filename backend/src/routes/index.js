const express = require('express');
const router = express.Router();
const userRoutes = require('./user.routes.js');
const appointmentRoutes = require('./appointment.routes.js');
const doctorRoutes = require('./doctor.routes.js');
const queueRoutes = require('./queue.route.js');

// Mount user routes
router.use('/users', userRoutes);

// Mount appointment routes
router.use('/appointments', appointmentRoutes);

// Mount doctor routes
router.use('/doctors', doctorRoutes);

router.use('/queue', queueRoutes);
module.exports = router;
