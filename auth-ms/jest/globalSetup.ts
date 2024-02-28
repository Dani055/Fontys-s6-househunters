import connectToDB from "auth-ms/src/database/database";
import dotenv from 'dotenv';
import { userForAuthTests } from './dummyData';
import { cleanUpDatabase } from './globalTeardown';
import UserEntity from 'auth-ms/src/models/User';
import { ResponseError } from "shared/responses/responseError";

dotenv.config({path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'})

const insertDummyData = async () => {
      await connectToDB()
      await UserEntity.create(userForAuthTests);
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