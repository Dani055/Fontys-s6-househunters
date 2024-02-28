import mongoose from 'mongoose';
import UserEntity from "auth-ms/src/models/User";
import { ResponseError } from 'shared/responses/responseError';

export const cleanUpDatabase = async () => {
    console.log('Cleaning up database');
    await UserEntity.deleteMany({});
    await mongoose.disconnect();
};

export default async function Teardown() {
    try {
      await cleanUpDatabase();
    } catch (error: any) {
      throw new ResponseError(500, error.message);
    }
  }