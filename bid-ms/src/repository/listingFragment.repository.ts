import { ResponseError } from "shared/responses/responseError";
import BidEntity from "../models/Bid";
import ListingFragmentEntity, { IListingFragment } from "../models/ListingFragment";

export const saveListingFragment = async (listingFragment: IListingFragment) => {
    const listing = await ListingFragmentEntity.findById(listingFragment._id);
    if(listing) return;

    const listingCreated = await ListingFragmentEntity.create(listingFragment);
    return listingCreated as IListingFragment;
};
export const getListingFragmentById = async (listingId: string) => {
    const listing = await ListingFragmentEntity.findById(listingId);;
    if(!listing){
        throw new ResponseError(404, 'Listing with specified id not found')
    }
    return listing as IListingFragment;
};
export const editListingFragment = async (listingFragment: IListingFragment) => {
    const listing = await ListingFragmentEntity.findByIdAndUpdate(listingFragment._id, {...listingFragment, _id: undefined}, {new: true});
    // Nice idea to system log here if listing is null
    return listing as IListingFragment
};
export const deleteListingFragment = async (listingId: string) => {
    await Promise.all([
        ListingFragmentEntity.deleteOne({_id: listingId}),
        BidEntity.deleteMany({listingId: listingId})
    ])
    return true;
};