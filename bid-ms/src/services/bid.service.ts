import { createBidPayload } from 'shared/requests/req';
import { createBid, getBidsByListingId } from '../repository/bid.repository';
import { ResponseError } from 'shared/responses/responseError';
import { getListingFragmentById } from '../repository/listingFragment.repository';
import { hasListingStarted, hasListingEnded} from 'shared/functions/listingValidator';

export const postBid = async (userId: string, listingId: string, bidInfo: createBidPayload) => {
    const bids = await getBidsByListingId(listingId);
    const listing = await getListingFragmentById(listingId);
    if(!hasListingStarted(listing.startsOn)){
        throw new ResponseError(400, "Listing has not started yet")
    }
    else if(hasListingEnded(listing.endsOn)){
        throw new ResponseError(400, "Listing has ended")
    }
    else if(userId === listing.creatorId.toString()){
        throw new ResponseError(400, "You cannot bid on your own listing")
    }
    else if(bidInfo.amount < listing.startingPrice){
        throw new ResponseError(400, "Bid is not above the minimum amount")
    }
    else if(bidInfo.amount <= bids[0]?.amount){
        throw new ResponseError(400, "Bid is less than the current highest bid")
    }
    return await createBid(userId, listingId, bidInfo)
};
export const getBidsForListing = async (listingId: string) => {
    const bids = await getBidsByListingId(listingId);
    return bids;
};