import * as amqp from "amqplib";
import ListingFragmentEntity, { IListingFragment } from "../models/ListingFragment";
import {
  deleteListingFragment,
  editListingFragment,
  saveListingFragment,
} from "../repository/listingFragment.repository";
import { subToQueue } from "shared/messaging/subToQueue";
import BidEntity from "../models/Bid";

export async function subToExchanges(channel: amqp.Channel) {
  channel.on("error", (error) => {
    console.log("Error occurred during message consumption:", error);
  });
  await subToQueue(channel, "accountDeletedBidSub", handleAccountDeleted);
  await subToQueue(channel, "listingCreatedBidSub", handleListingCreated);
  await subToQueue(channel, "listingEditedBidSub", handleListingEdited);
  await subToQueue(channel, "listingDeletedBidSub", handleListingDeleted);
}

async function handleListingCreated(channel: amqp.Channel, msg: amqp.Message) {
  const eventData: IListingFragment = JSON.parse(msg.content.toString());
  await saveListingFragment(eventData);
  (channel as amqp.Channel).ack(msg);
}
async function handleAccountDeleted(channel: amqp.Channel, msg: amqp.Message) {
  const userId: string = JSON.parse(msg.content.toString());
  await Promise.all([
    BidEntity.updateMany({creatorId: userId}, {creatorId: null}),
    ListingFragmentEntity.updateMany({creatorId: userId}, {creatorId: null}),
  ]);

  (channel as amqp.Channel).ack(msg);
}
async function handleListingEdited(channel: amqp.Channel, msg: amqp.Message) {
  const eventData: {
    listing: IListingFragment;
    imagesToDelete: string[];
  } = JSON.parse(msg.content.toString());
  await editListingFragment(eventData.listing);
  (channel as amqp.Channel).ack(msg);
}
async function handleListingDeleted(channel: amqp.Channel, msg: amqp.Message) {
  const eventData: { listingId: string; imagesToDelete: string[] } = JSON.parse(
    msg.content.toString()
  );
  await deleteListingFragment(eventData.listingId);
  (channel as amqp.Channel).ack(msg);
}
