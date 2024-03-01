import CommentEntity from "listing-ms/src/models/Comment";
import connectToDB from "listing-ms/src/database/database";
import dotenv from 'dotenv';
import { comment1 } from './dummyData';
import { cleanUpDatabase } from './globalTeardown';
import { ResponseError } from "shared/responses/responseError";

dotenv.config({path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'})

const insertDummyData = async () => {
      await connectToDB()
      await CommentEntity.create(comment1);
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