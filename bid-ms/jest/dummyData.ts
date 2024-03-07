import { IListingFragment } from 'bid-ms/src/models/ListingFragment';
import { Types } from 'mongoose';
import dayjs from 'dayjs'

const startsOn = dayjs().add(2, 'day');
const endsOn = dayjs().add(3, 'day');

export const userForJwt = {
    _id: "111111111111111111111111",
    roles: ['User'],
}
export const fragmentToReturn: IListingFragment = {
    _id: new Types.ObjectId("211111111111111111111111"),
    creatorId: new Types.ObjectId(userForJwt._id),
    startingPrice: 10000,
    buyoutPrice: 60000,
    startsOn: startsOn.toDate(),
    endsOn: endsOn.toDate(),
}
export const fragmentForIntegration: IListingFragment = {
    _id: new Types.ObjectId("211111111111111111111112"),
    creatorId: new Types.ObjectId(userForJwt._id),
    startingPrice: 500,
    buyoutPrice: 1000,
    startsOn: startsOn.toDate(),
    endsOn: endsOn.toDate(),
}
export const bidForDeletion = {
    _id: new Types.ObjectId("411111111111111111111111"),
    listingId: fragmentForIntegration._id,
    creatorId: new Types.ObjectId(userForJwt._id),
    amount: 5555,
}