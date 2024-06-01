import { changeListing, getListingDetails, getListings, postListing, removeListing } from '../services/listing.service';
import { RequestHandler } from 'express';
import { createListingPayload } from 'shared/requests/req';
import { mapListingToDTO } from '../converters/listingDTO';

export const handleCreateListing: RequestHandler = async (req, res, next) => {
  try {
    const listingInfo: createListingPayload = req.body;
    const listing = await postListing(req.userId, listingInfo);
    const listingDto = mapListingToDTO(listing);
    
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
    const listingDto = mapListingToDTO(newListing);

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
    await removeListing(req.userId, req.userRoles, listingId);

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

