import connectToDB from "bid-ms/src/database/database";
import dotenv from "dotenv";
import { cleanUpDatabase } from "./globalTeardown";
import { ResponseError } from "shared/responses/responseError";
import BidEntity from "bid-ms/src/models/Bid";
import { bidForDeletion } from "./dummyData";

dotenv.config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });

const insertDummyData = async () => {
  await connectToDB();
  await BidEntity.create(bidForDeletion);
};

export default async function Setup() {
  try {
    console.log("Populating database");
    await insertDummyData();
  } catch (error: any) {
    await cleanUpDatabase();
    throw new ResponseError(500, error.message);
  }
}
