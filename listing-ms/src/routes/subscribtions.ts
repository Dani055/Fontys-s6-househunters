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
  const userListings = await ListingEntity.find({creatorId: userId})
  await Promise.all(userListings.map((listing) => {
    deleteListing(listing, listing._id.toString());
  }))
  const userComments = await CommentEntity.find({creatorId: userId});
  await Promise.all(userComments.map((comment) => {
    deleteComment(comment._id.toString())
  }));

  (channel as amqp.Channel).ack(msg);
}
export async function subToExchanges(channel: amqp.Channel) {
  channel.on("error", (error) => {
    console.log("Error occurred during message consumption:", error);
  });
  await subToQueue(channel, "mediaUploadedListingSub", onMediaUploaded);
  await subToQueue(channel, "accountDeletedListingSub", onAccountDeleted);
}

