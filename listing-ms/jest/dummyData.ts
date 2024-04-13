import { Types } from 'mongoose';
import { createListingPayload } from 'shared/requests/req';
import dayjs from 'dayjs'
import { IListing } from 'listing-ms/src/models/Listing';
import { IComment } from 'listing-ms/src/models/Comment';

export const userForJwt = {
    _id: "111111111111111111111111",
    roles: ['User'],
}

const startsOn = dayjs().add(2, 'day');
const endsOn = dayjs().add(3, 'day');

export const listingPayload = {
    propertyType: "Fragment house",
    buildYear: 1997,
    size: 120,
    listingDescription: "description",
    startingPrice: 10000,
    buyoutPrice: 60000,
    location: "Eindhoven",
    startsOn: startsOn.toDate().toISOString(),
    endsOn: endsOn.toDate().toISOString(),
    newImages: false,
}
export const listingPayload2: createListingPayload = {
    propertyType: "Fragment house",
    buildYear: 1997,
    size: 120,
    listingDescription: "description",
    startingPrice: 10000,
    buyoutPrice: 60000,
    location: "Eindhoven",
    startsOn: startsOn.toDate(),
    endsOn: endsOn.toDate(),
    newImages: false,
}
export const listingToReturn: IListing = {
    _id: new Types.ObjectId("211111111111111111111111"),
    creatorId: new Types.ObjectId(userForJwt._id),
    propertyType: "Fragment house",
    buildYear: 1997,
    size: 120,
    listingDescription: "description",
    startingPrice: 10000,
    buyoutPrice: 60000,
    location: "Eindhoven",
    hasSold: false,
    images: [],
    startsOn: startsOn.toDate(),
    endsOn: endsOn.toDate(),
}
export const commentToReturn: IComment = {
    _id: new Types.ObjectId("311111111111111111111111"),
    text: "comment",
    listingId: new Types.ObjectId("211111111111111111111111"),
    createdAt: dayjs().toDate(),
    creatorId: new Types.ObjectId(userForJwt._id),
}

export const listingForCommentsTests = {
    _id: new Types.ObjectId("211111111111111111111111"),
    creatorId: new Types.ObjectId("111111111111111111111111"),
    hasSold: false,
    comments: [],
    images: [],
    propertyType: "Property for testing comments CRUD",
    buildYear: 2055,
    size: 30,
    listingDescription: "This listing is used for comments integration tests",
    startingPrice: 2000,
    buyoutPrice: 2001,
    location: "Comments",
    startsOn: dayjs(),
    endsOn: dayjs()
  };