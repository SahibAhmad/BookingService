const express = require('express');
const { BookingController } = require('../../controllers/index.js');

const router = express.Router();

router.post('/bookings',BookingController.create);
router.patch('/bookings/:id',BookingController.update);

router.post('/publish',BookingController.sendMessageToQueue);

module.exports = router;