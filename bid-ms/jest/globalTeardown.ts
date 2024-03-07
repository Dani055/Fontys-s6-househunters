import BidEntity from 'bid-ms/src/models/Bid';
import ListingFragmentEntity from 'bid-ms/src/models/ListingFragment';
import mongoose from 'mongoose';
import { ResponseError } from 'shared/responses/responseError';

export const cleanUpDatabase = async () => {
    console.log('Cleaning up database');
    await BidEntity.deleteMany({});
    await ListingFragmentEntity.deleteMany({});
    await mongoose.disconnect();
};

export default async function Teardown() {
    try {
      await cleanUpDatabase();
    } catch (error: any) {
      throw new ResponseError(500, error.message);
    }
  }