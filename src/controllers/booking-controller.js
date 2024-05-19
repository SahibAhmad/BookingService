const { StatusCodes } = require('http-status-codes');
const { BookingService } = require('../services/index.js');
const {REMINDER_BINDING_KEY} = require('../config/serverConfig');
const bookingService = new BookingService();

const {createChannel , publishMessage} = require('../utils/messageQueue.js');

const  sendMessageToQueue = async (req,res) => {
    //demo function of publishing to queues

  try {
    
      const channel = await createChannel();
      const data = {
        message : {
            subject: "message queue demo",
            content: "This is simple demo for message queue implementation",
            recepientEmail: "sahibprojects998@gmail.com",
            notificationTime : "2024-05-18 19:00:07",
        },
        service : "CREATE_TICKET",
    };
 
  
      await publishMessage(channel,REMINDER_BINDING_KEY,JSON.stringify(data));
  
      return res.status(200).json({
          message: "Successfully published the event",
          err: {},
      });
  } catch (error) {
   
    return res.status(500).json({
        message: "couldnt publish event",
        err: error,
    });
  }
}
const create = async (req,res) => {
    try {
        
        const response = await bookingService.createBooking(req.body);
        
        return res.status(StatusCodes.OK).json({
            message: "Successfully Completed Booking",
            success: true,
            err: {},
            data: response,

        });
    } catch (error) {
        return res.status(error.statusCode).json({
            message: error.message,
            success: false,
            err: error.explanation,
            data: {},
        });
    }
}

const update = async (req,res) => {
    try {
        const response = await bookingService.update(req.params.id,req.body);
        return res.status(StatusCodes.OK).json({
            message: "Successfully Updated/Cancelled booking ",
            success: true,
            err: {},
            data: response,
        });
    } catch (error) {
        return res.status(error.statusCode).json({
            message: error.message,
            success: false,
            err: error.explanation,
            data: {},

        });
    }
}


module.exports = {
    create,
    update,
    sendMessageToQueue

}