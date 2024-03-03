import { createBidPayload } from "shared/requests/req";
import BidEntity, { IBid } from "../models/Bid";

export const createBid = async (userId: string, listingId: string, payload: createBidPayload) => {
    // const listing = await ListingEntity.findById(listingId).orFail();
    const bid = await BidEntity.create({...payload, creatorId: userId, listingId: listingId, createdOn: undefined});
    return bid as IBid
};
export const getBidsByListingId = async (listingId: string) => {
    const bids = await BidEntity.find({listingId: listingId}).sort({amount: -1})
    return bids as IBid[];
};