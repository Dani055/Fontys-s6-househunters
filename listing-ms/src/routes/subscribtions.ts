import * as amqp from "amqplib";
import { assignListingPhotos, deleteListing } from "../repository/listing.repository";
import { subToQueue } from 'shared/messaging/subToQueue'
import ListingEntity from "../models/Listing";
import CommentEntity from "../models/Comment";
import { deleteComment } from "../repository/comment.repository";

interface uploadedMedia {
  listingId: string;
  links: string[];
}

async function onMediaUploaded(channel: amqp.Channel, msg: amqp.Message) {
  const eventData: uploadedMedia = JSON.parse(msg.content.toString());
  await assignListingPhotos(eventData.listingId, eventData.links);
  (channel as amqp.Channel).ack(msg);
}
async function onAccountDeleted(channel: amqp.Channel, msg: amqp.Message) {
  const userId: string = JSON.parse(msg.content.toString());
  await Promise.all([
    ListingEntity.updateMany({creatorId: userId}, {creatorId: null}),
    CommentEntity.updateMany({creatorId: userId}, {creatorId: null})
  ]);
  
  (channel as amqp.Channel).ack(msg);
}
export async function subToExchanges(channel: amqp.Channel) {
  channel.on("error", (error) => {
    console.log("Error occurred during message consumption:", error);
  });
  await subToQueue(channel, "mediaUploadedListingSub", onMediaUploaded);
  await subToQueue(channel, "accountDeletedListingSub", onAccountDeleted);
}

