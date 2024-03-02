import * as amqp from 'amqplib';

let channel: amqp.Channel | null = null;

async function connectToRabbitMQ() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        channel = await connection.createChannel();
        await channel.assertExchange("listing_created",'fanout', { durable: false });
        await channel.assertExchange("listing_edited",'fanout', { durable: false });
        await channel.assertExchange("listing_deleted",'fanout', { durable: false });
        await channel.assertExchange("media_uploaded",'fanout', { durable: false });

        await channel.assertQueue("mediaUploadedListingSub", { durable: false });

        await channel.bindQueue('mediaUploadedListingSub', 'media_uploaded', '');
        
        console.log("Connected to RabbitMQ");
    } catch (error) {
        console.error("Error connecting to RabbitMQ:", error);
    }
}

export {connectToRabbitMQ, channel}