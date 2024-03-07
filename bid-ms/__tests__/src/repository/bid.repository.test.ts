import app from "bid-ms/index";
import mongoose, { Types } from "mongoose";
import { createBid, getBidsByListingId } from "bid-ms/src/repository/bid.repository";

// Wait for app to fully start. For some reason the tests do not wait for it otherwise
beforeAll((done) => {
  app.on("appStarted", () => done());
});
afterAll(async () => {
  await mongoose.disconnect();
});
let createdBidId: string;
const userId = "111111111111111111111111";
const listingId = "211111111111111111111111";

describe("Bid repository", () => {
  describe("createBid", () => {
    it("Returns created bid", async () => {
      // Arrange
      const payload = {
        amount: 1234
      };
      const expectedBid = {
        ...payload,
        creatorId: new Types.ObjectId(userId),
        listingId: new Types.ObjectId(listingId),
      };

      // Act
      const createdBid = await createBid(userId, listingId.toString(), payload);
      createdBidId = createdBid._id.toString();

      // Assert
      expect(createdBid).toMatchObject(expectedBid);
    });
  });
  describe("getBidsByListingId", () => {
    it("Returns bids for listing", async () => {
      // Arrange
      const expectedBids = [{
        _id: new Types.ObjectId(createdBidId),
        amount: 1234,
        creatorId: new Types.ObjectId(userId),
        listingId: new Types.ObjectId(listingId),
      }];

      // Act
      const bids = await getBidsByListingId(listingId.toString());
      console.log(bids);
      // Assert
      expect(bids).toMatchObject(expectedBids);
    });
  });
});
