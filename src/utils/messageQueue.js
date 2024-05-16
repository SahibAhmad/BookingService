const amqlib = require('amqplib');
const {EXCHANGE_NAME , MESSAGE_BROKER_URL} = require('../config/serverConfig');
const createChannel = async () => {
    try {
        const connection = await amqlib.connect(MESSAGE_BROKER_URL);
        const channel = await connection.createChannel();

        await channel.assertExchange(EXCHANGE_NAME, 'direct', false); //see this in docs
        
        return channel;

    } catch (error) {
        throw error;
    }
}
const publishMessage = async (channel, binding_key, message) => {
    try {
        const QUEUE_NAME = 'email';
        const applicationQueue = await channel.assertQueue(QUEUE_NAME);

        await channel.publish(EXCHANGE_NAME,binding_key,Buffer.from(message));
    } catch (error) {
        
    }
}
const subscribeMessage = async (channel,service,binding_key) => {
    try {
        const QUEUE_NAME = 'email';
        const applicationQueue = await channel.assertQueue(QUEUE_NAME);

        channel.bindQueue(applicationQueue.queue, EXCHANGE_NAME, binding_key);

        channel.consume(applicationQueue.queue, msg=> {
            console.log('Recieved data! ');
            console.log(msg.content.toString());
            channel.ack(msg); //otherwise we may not clear the service 

        } );
    } catch (error) {
        throw error;
    }
}

module.exports = {
    subscribeMessage,
    createChannel,
    publishMessage
}