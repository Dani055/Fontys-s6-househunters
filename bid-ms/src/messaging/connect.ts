import * as amqp from 'amqplib';

let channel: amqp.Channel | null = null;

async function connectToRabbitMQ() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        channel = await connection.createChannel();

        // Create exchange in case it does not exist
        await channel.assertExchange('listing_created', 'fanout', {
            durable: false
        });
        await channel.assertExchange('listing_edited', 'fanout', {
            durable: false
        });
        await channel.assertExchange('listing_deleted', 'fanout', {
            durable: false
        });

        await channel.assertQueue("listingCreatedBidSub", { durable: false });
        await channel.assertQueue("listingEditedBidSub", { durable: false });
        await channel.assertQueue("listingDeletedBidSub", { durable: false });

        await channel.bindQueue('listingCreatedBidSub', 'listing_created', '');
        await channel.bindQueue('listingEditedBidSub', 'listing_edited', '');
        await channel.bindQueue('listingDeletedBidSub', 'listing_deleted', '');

        console.log("Connected to RabbitMQ");
    } catch (error) {
        console.error("Error connecting to RabbitMQ:", error);
    }
}

export {channel, connectToRabbitMQ}