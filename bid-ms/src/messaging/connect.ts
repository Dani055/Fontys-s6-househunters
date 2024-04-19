import * as amqp from 'amqplib';

let channel: amqp.Channel | null = null;

async function connectToRabbitMQ() {
    const maxRetries = 5;
    let retries = 0;

    return new Promise<void>((resolve, reject) => {
        const attemptConnection = async () => {
            try {
                const options = { credentials: amqp.credentials.plain(process.env.RABBITMQ_USERNAME, process.env.RABBITMQ_PASSWORD)}
                const connection = await amqp.connect(`amqp://${process.env.RABBITMQ_HOST}`, options);
                channel = await connection.createChannel();
        
                // Create exchange in case it does not exist
                await channel.assertExchange('account_deleted', 'fanout', {
                    durable: false
                });
                await channel.assertExchange('listing_created', 'fanout', {
                    durable: false
                });
                await channel.assertExchange('listing_edited', 'fanout', {
                    durable: false
                });
                await channel.assertExchange('listing_deleted', 'fanout', {
                    durable: false
                });
        
                await channel.assertQueue("accountDeletedBidSub", { durable: false });
                await channel.assertQueue("listingCreatedBidSub", { durable: false });
                await channel.assertQueue("listingEditedBidSub", { durable: false });
                await channel.assertQueue("listingDeletedBidSub", { durable: false });
        
                await channel.bindQueue('accountDeletedBidSub', 'account_deleted', '');
                await channel.bindQueue('listingCreatedBidSub', 'listing_created', '');
                await channel.bindQueue('listingEditedBidSub', 'listing_edited', '');
                await channel.bindQueue('listingDeletedBidSub', 'listing_deleted', '');
        
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

export { connectToRabbitMQ, channel };