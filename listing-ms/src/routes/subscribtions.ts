import * as amqp from "amqplib";
import { assignListingPhotos } from "../repository/listing.repository";
import { subToQueue } from 'shared/messaging/subToQueue'

interface uploadedMedia {
  listingId: string;
  links: string[];
}

async function onMediaUploaded(channel: amqp.Channel, msg: amqp.Message) {
  const eventData: uploadedMedia = JSON.parse(msg.content.toString());
  await assignListingPhotos(eventData.listingId, eventData.links);
  (channel as amqp.Channel).ack(msg);
}

export async function subToExchanges(channel: amqp.Channel) {
  channel.on("error", (error) => {
    console.log("Error occurred during message consumption:", error);
  });
  await subToQueue(channel, "mediaUploadedListingSub", onMediaUploaded);
}

