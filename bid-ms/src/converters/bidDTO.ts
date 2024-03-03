import { BidDTO } from "shared/dtos/bidDTO"
import { IBid } from "../models/Bid";

export function mapBidToDTO(bid: IBid): BidDTO {
    const bidDto: BidDTO = {
        _id: bid._id.toString(),
        creatorId: bid.creatorId.toString(),
        listingId: bid.listingId.toString(),
        amount: bid.amount,
        createdAt: bid.createdAt
    }
    return bidDto;
}