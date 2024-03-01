import { Types } from 'mongoose';
export const comment1 = {
    _id: new Types.ObjectId("411111111111111111111111"),
    text: "First comment",
    creatorId: new Types.ObjectId("111111111111111111111111"),
    listingId: new Types.ObjectId("211111111111111111111111"),
}