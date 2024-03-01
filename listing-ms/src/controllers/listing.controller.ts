import { changeListing, getListingDetails, getListings, postListing, removeListing } from '../services/listing.service';
import { RequestHandler } from 'express';
import { createListingPayload } from 'shared/requests/req';
import { mapListingToDTO } from '../converters/listingDTO';
import { channel } from '../messaging/connect';

export const handleCreateListing: RequestHandler = async (req, res, next) => {
  try {
    const listingInfo: createListingPayload = req.body;
    const listing = await postListing(req.userId, listingInfo);
    const listingDto = mapListingToDTO(listing);
    
    channel?.publish('listing_created', '', Buffer.from(JSON.stringify(listing)));
    
    const response = {
      message: 'Listing created',
      listing: listingDto
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
export const handleChangeListing: RequestHandler = async (req, res, next) => {
  try {
    const listingInfo: createListingPayload = req.body;
    const listingId = req.params.listingId;
    const newListing = await changeListing(req.userId, req.userRoles, listingInfo, listingId);
    const listingDto = mapListingToDTO(newListing.listing);

    channel?.publish('listing_edited', '', Buffer.from(JSON.stringify({listing: newListing.listing, imagesToDelete: newListing.imagesToDelete})));

    const response = {
      message: 'Listing edited',
      listing: listingDto
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
export const handleRemoveListing: RequestHandler = async (req, res, next) => {
  try {
    const listingId = req.params.listingId as string;
    const imagesToDelete = await removeListing(req.userId, req.userRoles, listingId);
    channel?.publish('listing_deleted', '', Buffer.from(JSON.stringify({listingId, imagesToDelete})));
    
    const response = {
      message: 'Listing deleted'
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
export const handleGetListings: RequestHandler = async (req, res, next) => {
  try {
    const result = await getListings(req.query);
    const listingDtos = result.listings.map((listing) => {
      return mapListingToDTO(listing);
    })

    const response = {
      message: 'Listings fetched',
      listings: listingDtos,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      totalHist: result.totalHits
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
export const handleGetListingDetails: RequestHandler = async (req, res, next) => {
  try {
    const listingId = req.params.listingId as string;
    const listing = await getListingDetails(listingId);
    const listingDto = mapListingToDTO(listing);

    const response = {
      message: 'Listing fetched',
      listing: listingDto
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

