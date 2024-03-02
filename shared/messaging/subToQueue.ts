import * as amqp from "amqplib";

export async function subToQueue(
  channel: amqp.Channel,
  queueName: string,
  callback: Function
) {
  await channel.consume(
    queueName,
    async (msg) => {
      if (msg !== null) {
        try {
          await callback(channel, msg);
        } catch (error: any) {
          if (error.name === "CastError") {
            (channel as amqp.Channel).ack(msg);
          }
          console.log(error);
        }
      }
    },
    { noAck: false }
  );
}
