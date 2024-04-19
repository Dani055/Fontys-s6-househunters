import mongoose from 'mongoose';
import CommentEntity from "../src/models/Comment";
import { ResponseError } from 'shared/responses/responseError';
import ListingEntity from 'listing-ms/src/models/Listing';

export const cleanUpDatabase = async () => {
    console.log('Cleaning up database');
    await CommentEntity.deleteMany({});
    await ListingEntity.deleteMany({})
    await mongoose.disconnect();
};

export default async function Teardown() {
    try {
      await cleanUpDatabase();
    } catch (error: any) {
      throw new ResponseError(500, error.message);
    }
  }