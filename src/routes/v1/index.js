const express = require('express');
const { BookingController } = require('../../controllers/index.js');

const router = express.Router();

router.post('/bookings',BookingController.create);
router.patch('/bookings/:id',BookingController.update);

router.post('/publish',BookingController.sendMessageToQueue);

router.get ('/home',(req,res)=>{
    console.log("api hit");
return res.json({message: "hitting booking service"});
});

module.exports = router;