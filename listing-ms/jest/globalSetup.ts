import CommentEntity from "listing-ms/src/models/Comment";
import connectToDB from "listing-ms/src/database/database";
import dotenv from 'dotenv';

import { cleanUpDatabase } from './globalTeardown';
import { ResponseError } from "shared/responses/responseError";
import ListingEntity from "listing-ms/src/models/Listing";
import { listingForCommentsTests } from "./dummyData";

dotenv.config({path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'})

const insertDummyData = async () => {
      await connectToDB()
      await ListingEntity.create(listingForCommentsTests)
}
export default async function Setup() {
    try {
      console.log('Populating database')
      await insertDummyData();
    } catch (error: any) {
      await cleanUpDatabase();
      throw new ResponseError(500, error.message);
    }
  }