import { RequestHandler } from 'express';
import { createBidPayload } from 'shared/requests/req';
import { BidDtoResponse } from 'shared/responses/res';
import { postBid, } from '../services/bid.service';
import { mapBidToDTO } from '../converters/bidDTO';
import { getBidsByListingId } from '../repository/bid.repository';


export const handleCreateBid: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.userId;
    const listingId = req.query.listingId as string;
    const bidInfo: createBidPayload = req.body
    const bid = await postBid(userId, listingId, bidInfo);
    const bidDTO = mapBidToDTO(bid);

    const response: BidDtoResponse = {
      message: 'Bid created',
      bid: bidDTO
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
export const handleGetBidsForListing: RequestHandler = async (req, res, next) => {
  try {
    const listingId = req.query.listingId as string;
    const bids = await getBidsByListingId(listingId);

    const bidDtos = bids.map((bid) => {
      return mapBidToDTO(bid);
    })
    const response = {
      message: 'Bids fetched',
      bids: bidDtos
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};