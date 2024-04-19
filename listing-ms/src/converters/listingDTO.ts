import { IListing } from "../models/Listing";
import { mapCommentToDTO } from "./commentDTO";
import { CommentDTO } from "shared/dtos/commentDTO";
import { ListingDTO } from "shared/dtos/listingDTO";

export function mapListingToDTO(listing: IListing) {
    let commentsDto: CommentDTO[] | undefined = undefined;
    if (listing.comments) {
        commentsDto = listing.comments.map((comment) => {
            return mapCommentToDTO(comment);
        })
    }
    const listingDto: ListingDTO = {
        _id: listing._id.toString(),
        propertyType: listing.propertyType,
        size: listing.size,
        buildYear: listing.buildYear,
        listingDescription: listing.listingDescription,
        startingPrice: listing.startingPrice,
        buyoutPrice: listing.buyoutPrice,
        hasSold: listing.hasSold,
        location: listing.location,
        startsOn: listing.startsOn,
        endsOn: listing.endsOn,
        creatorId: listing.creatorId ? listing.creatorId.toString() : null,
        images: listing.images,
        comments: commentsDto
    }

    return listingDto;
}