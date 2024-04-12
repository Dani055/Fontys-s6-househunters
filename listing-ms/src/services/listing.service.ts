import { createListing, deleteListing, editListing, fetchListings, getListingbyId,  } from '../repository/listing.repository';
import { createListingPayload } from 'shared/requests/req';
import { IListing } from '../models/Listing';
import { hasRequiredRoles } from 'shared/functions/hasRequiredRoles'
import { hasListingStarted, validateListingDates } from 'shared/functions/listingValidator'
import { ResponseError } from 'shared/responses/responseError';

export const postListing = async (userId: string, payload: createListingPayload): Promise<IListing> => {
    const listing = await createListing(userId, payload);
    return listing;
};
export const changeListing = async (userId: string, userRoles: string[], payload: createListingPayload, listingId: string) => {
    const originalListing = await getListingbyId(listingId);
    // Not owner or admin
    if(originalListing.creatorId.toString() !== userId && !hasRequiredRoles(userRoles, ['Admin'])){
        throw new ResponseError(401, "You are not authorized to change this listing")
    }
    // 
    else if(originalListing.creatorId.toString() === userId && !hasRequiredRoles(userRoles, ['Admin']) && hasListingStarted(originalListing.startsOn)){
        throw new ResponseError(401, "Cannot change listing info. It has already started")
    }
    validateListingDates(payload.startsOn, payload.endsOn);
    const editedListing = await editListing(listingId, payload);
    return editedListing;
};
export const removeListing = async (userId: string, userRoles: string[], listingId: string) => {
    const originalListing = await getListingbyId(listingId);
    // Not owner or admin
    if(originalListing.creatorId.toString() !== userId && !hasRequiredRoles(userRoles, ['Admin'])){
        throw new ResponseError(401, "You are not authorized to delete this listing")
    }
    // 
    else if(originalListing.creatorId.toString() === userId && !hasRequiredRoles(userRoles, ['Admin']) && hasListingStarted(originalListing.startsOn)){
        throw new ResponseError(401, "Cannot delete listing. It has already started")
    }
    const result = await deleteListing(originalListing, listingId)
    return result;
};
export const getListings = async (query: any) => {
    return await fetchListings(query)
};
export const getListingDetails = async (listingId: string): Promise<IListing> => {
    const listing = await getListingbyId(listingId, true);
    return listing;
};