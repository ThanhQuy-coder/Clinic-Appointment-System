const express = require('express');
const router = express.Router();
const userRoutes = require('./user.routes.js');
const appointmentRoutes = require('./appointment.routes.js');

// Mount user routes
router.use('/users', userRoutes);

// Mount appointment routes
router.use('/appointments', appointmentRoutes);

module.exports = router;
