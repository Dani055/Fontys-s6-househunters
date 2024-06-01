import { ResponseError } from 'shared/responses/responseError';
import CommentEntity from '../models/Comment';
import ListingEntity, { IListing } from '../models/Listing';
import { createListingPayload } from 'shared/requests/req';
import dayjs from 'dayjs';
import { channel } from '../messaging/connect';
import mongoose from 'mongoose';

export const createListing = async (userId: string, payload: createListingPayload) => {
        const listing = await ListingEntity.create({ ...payload, images: [], creatorId: userId });
        channel?.publish('listing_created', '', Buffer.from(JSON.stringify(listing)));
        return listing as IListing
    // const session = await mongoose.startSession();
    // session.startTransaction()
    // try {
    //     const [listing] = await ListingEntity.create([{ ...payload, images: [], creatorId: userId }], {session});
    //     channel?.publish('listing_created', '', Buffer.from(JSON.stringify(listing)));
    //     await session.commitTransaction();
    //     return listing as IListing

    // } catch (error) {
    //     console.log("ABORTING TRANSACTION")
    //     await session.abortTransaction();
    //     throw error;
    // } finally {
    //     session.endSession();
    //     console.log("ENDING SESSION");
    // }
};
export const editListing = async (originalListing: IListing, payload: createListingPayload) => {

    const listing = await ListingEntity.findByIdAndUpdate(originalListing._id, { ...payload, creatorId: undefined, hasSold: false, images: payload.newImages ? [] : undefined, comments: undefined }, { new: true })
    const imagesToDelete = payload.newImages ? originalListing.images : [];
    channel?.publish('listing_edited', '', Buffer.from(JSON.stringify({ listing: listing, imagesToDelete })));

    return listing as IListing

};
export const assignListingPhotos = async (listingId: string, links: string[]) => {
    const listing = await ListingEntity.findByIdAndUpdate(listingId, { images: links }, { new: true });
    return listing as IListing
};
export const deleteListing = async (originalListing: IListing, listingId: string) => {
    const imagesToDelete = originalListing.images;
    await Promise.all([
        ListingEntity.deleteOne({ _id: listingId }),
        CommentEntity.deleteMany({ listingId: listingId })
    ])
    channel?.publish('listing_deleted', '', Buffer.from(JSON.stringify({ listingId, imagesToDelete })));
    return true;
};
export const getListingbyId = async (listingId: string) => {
    let listing = await ListingEntity.findById(listingId);
    if (!listing) {
        throw new ResponseError(404, 'Listing with specified id not found')
    }
    return listing as IListing;
};

export const fetchListings = async (reqQuery: any) => {
    const { page = 0, hasEnded, creatorId } = reqQuery;
    let query: any = {};
    let pageSize = 4

    const currentDate = dayjs();
    if (hasEnded === 'true') {
        query.endsOn = { $lt: currentDate };
    }
    else if (hasEnded === 'false') {
        query.endsOn = { $gte: currentDate };
    }
    if (creatorId) {
        query.creatorId = creatorId;
    }
    const [listings, totalCount] = await Promise.all([
        ListingEntity.find(query).sort({ startsOn: -1 }).skip(page * pageSize).limit(pageSize).exec() as Promise<IListing[]>,
        ListingEntity.countDocuments(query),
    ])
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
        listings,
        currentPage: page,
        totalPages,
        totalHits: totalCount
    }
};