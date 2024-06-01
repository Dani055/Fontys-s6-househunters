import * as amqp from 'amqplib';

let channel = null;

async function connectToRabbitMQ() {
    const maxRetries = 5;
    let retries = 0;

    return new Promise((resolve, reject) => {
        const attemptConnection = async () => {
            try {
                const options = { credentials: amqp.credentials.plain(process.env.RABBITMQ_USERNAME, process.env.RABBITMQ_PASSWORD)}
                const connection = await amqp.connect(`amqp://${process.env.RABBITMQ_HOST}`, options);
        
                channel = await connection.createChannel();
        
                await channel.assertExchange("media_uploaded",'fanout', { durable: true });
                await channel.assertExchange("listing_edited",'fanout', { durable: true });
                await channel.assertExchange("listing_deleted",'fanout', { durable: true });
        
                await channel.assertQueue("listingEditedMediaSub", { durable: true });
                await channel.assertQueue("listingDeletedMediaSub", { durable: true });
                await channel.bindQueue('listingEditedMediaSub', 'listing_edited', '');
                await channel.bindQueue('listingDeletedMediaSub', 'listing_deleted', '');
        
                console.log("Connected to RabbitMQ");
                resolve();
            } catch (error) {
                retries++;
                if (retries < maxRetries) {
                    console.log(`RabbitMQ connection attempt ${retries} failed. Retrying in 5 seconds...`);
                    setTimeout(attemptConnection, 5000); // Retry after 5 seconds
                } else {
                    reject(new Error(`Failed to connect to RabbitMQ after ${maxRetries} attempts`));
                }
            }
        };

        attemptConnection();
    });
}

export {connectToRabbitMQ, channel}