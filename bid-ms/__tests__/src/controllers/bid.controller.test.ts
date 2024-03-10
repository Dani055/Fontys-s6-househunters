import app from "bid-ms/index";
import mongoose, { Types } from "mongoose";
import request from "supertest";
import * as bidService from "bid-ms/src/services/bid.service";
import * as bidRepo from "bid-ms/src/repository/bid.repository";
import { mockJwt } from "bid-ms/jest/common";
import * as isAuth from "shared/middleware/is-auth";
import { userForJwt } from "bid-ms/jest/dummyData";
import dayjs from "dayjs";
import { IBid } from "bid-ms/src/models/Bid";

// Wait for app to fully start. For some reason the tests do not wait for it otherwise
beforeAll((done) => {
  app.on("appStarted", () => done());
});
afterAll(async () => {
  await mongoose.disconnect();
});

jest.mock("bid-ms/src/services/bid.service", () => {
  const original = jest.requireActual(
    "bid-ms/src/services/bid.service"
  );
  return {
    ...original,
    _esModule: true,
    postBid: jest.fn(),
  };
});
jest.mock("bid-ms/src/repository/bid.repository", () => {
    const original = jest.requireActual(
      "bid-ms/src/repository/bid.repository"
    );
    return {
      ...original,
      _esModule: true,
      getBidsByListingId: jest.fn(),
    };
  });
jest.mock("shared/middleware/is-auth", () => {
  return {
    isAuth: jest.fn(),
  };
});

const mockedService = bidService as jest.Mocked<typeof bidService>;
const mockedRepo = bidRepo as jest.Mocked<typeof bidRepo>;
const mockedJwt = isAuth as jest.Mocked<typeof isAuth>;

describe("Bid controller", () => {
  describe("handleCreateBid", () => {
    it("Returns created bid", async () => {
            // Arrange
            const listingId = "211111111111111111111111";
            const creatorid = userForJwt._id;
            const bidId = "411111111111111111111111";
            const now = dayjs();
        
            const bidToReturn: IBid = {
              _id: new Types.ObjectId(bidId),
              amount: 1234,
              listingId: new Types.ObjectId(listingId),
              createdAt: now.toDate(),
              creatorId: new Types.ObjectId(creatorid),
            };
            const expectedDto = {
              _id: bidId,
              amount: 1234,
              createdAt: now.toISOString(),
              listingId: listingId,
              creatorId: creatorid,
            }
            
            mockedService.postBid.mockResolvedValue(bidToReturn);
            mockJwt(mockedJwt, userForJwt);
      
            // Act
            const res = await request(app)
              .post(`/api/bid?listingId=${listingId}`)
              .set("Content-Type", "application/json")
              .send({amount: 1234});
            // Assert
            expect(mockedService.postBid).toBeCalledWith(
              creatorid,
              listingId,
              {amount: 1234}
            );
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({
              message: "Bid created",
              bid: expectedDto,
            });
    });
  });
  describe("handleGetBidsForListing", () => {
    it("Returns bids for listing", async () => {
            // Arrange
            const listingId = "211111111111111111111111";
            const creatorid = userForJwt._id;
            const bidId = "411111111111111111111111";
            const now = dayjs();
        
            const bidsToReturn: IBid[] = [{
              _id: new Types.ObjectId(bidId),
              amount: 1234,
              listingId: new Types.ObjectId(listingId),
              createdAt: now.toDate(),
              creatorId: new Types.ObjectId(creatorid),
            }];
            const expectedDtos = [{
              _id: bidId,
              amount: 1234,
              createdAt: now.toISOString(),
              listingId: listingId,
              creatorId: creatorid,
            }]
            
            mockedRepo.getBidsByListingId.mockResolvedValue(bidsToReturn);
            mockJwt(mockedJwt, userForJwt);
      
            // Act
            const res = await request(app)
              .get(`/api/bid?listingId=${listingId}`)

            // Assert
            expect(mockedRepo.getBidsByListingId).toBeCalledWith(listingId);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({
              message: "Bids fetched",
              bids: expectedDtos,
            });
    });
  });
});
