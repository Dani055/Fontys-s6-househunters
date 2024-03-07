import app from "bid-ms/index";
import mongoose, { Types } from "mongoose";
import * as bidRepo from "bid-ms/src/repository/bid.repository";
import * as fragmentRepo from "bid-ms/src/repository/listingFragment.repository";
import dayjs from "dayjs";
import { fragmentToReturn } from "bid-ms/jest/dummyData";
import { postBid } from "bid-ms/src/services/bid.service";
import { ResponseError } from "shared/responses/responseError";
import { IListingFragment } from "bid-ms/src/models/ListingFragment";
import { IBid } from "bid-ms/src/models/Bid";

// Wait for app to fully start. For some reason the tests do not wait for it otherwise
beforeAll((done) => {
  app.on("appStarted", () => done());
});
afterAll(async () => {
  await mongoose.disconnect();
});

jest.mock("bid-ms/src/repository/bid.repository", () => {
  const original = jest.requireActual("bid-ms/src/repository/bid.repository");
  return {
    ...original,
    _esModule: true,
    getBidsByListingId: jest.fn(),
    createBid: jest.fn(),
  };
});
jest.mock("bid-ms/src/repository/listingFragment.repository", () => {
  const original = jest.requireActual(
    "bid-ms/src/repository/listingFragment.repository"
  );
  return {
    ...original,
    _esModule: true,
    getListingFragmentById: jest.fn(),
  };
});

const mockedBidRepo = bidRepo as jest.Mocked<typeof bidRepo>;
const mockedFragmentRepo = fragmentRepo as jest.Mocked<typeof fragmentRepo>;

describe("Bid service", () => {
  describe("postBid", () => {
    it("Throws error when listing has not started yet", async () => {
      // Arrange
      const userId = "111111111111111111111112";
      const payload = { amount: 1234 };
      mockedFragmentRepo.getListingFragmentById.mockResolvedValue(
        fragmentToReturn
      );
      mockedBidRepo.getBidsByListingId.mockResolvedValue([]);

      // Act
      const callFunc = async () => {
        await postBid(userId, fragmentToReturn._id.toString(), payload);
      };

      // Assert
      await expect(callFunc).rejects.toThrow(ResponseError);
      await expect(callFunc).rejects.toThrow("Listing has not started yet");
    });
    it("Throws error when listing has ended", async () => {
      // Arrange
      const userId = "111111111111111111111112";
      const payload = { amount: 1234 };
      const expiredFragment: IListingFragment = {
        ...fragmentToReturn,
        startsOn: dayjs().subtract(5, "day").toDate(),
        endsOn: dayjs().subtract(4, "day").toDate(),
      };
      mockedFragmentRepo.getListingFragmentById.mockResolvedValue(
        expiredFragment
      );
      mockedBidRepo.getBidsByListingId.mockResolvedValue([]);

      // Act
      const callFunc = async () => {
        await postBid(userId, fragmentToReturn._id.toString(), payload);
      };

      // Assert
      await expect(callFunc).rejects.toThrow(ResponseError);
      await expect(callFunc).rejects.toThrow("Listing has ended");
    });
    it("Throws error bidder is listing owner", async () => {
      // Arrange
      const userId = "111111111111111111111111";
      const payload = { amount: 1234 };
      const runningListing: IListingFragment = {
        ...fragmentToReturn,
        startsOn: dayjs().subtract(1, "day").toDate(),
      };
      mockedFragmentRepo.getListingFragmentById.mockResolvedValue(
        runningListing
      );
      mockedBidRepo.getBidsByListingId.mockResolvedValue([]);

      // Act
      const callFunc = async () => {
        await postBid(userId, fragmentToReturn._id.toString(), payload);
      };

      // Assert
      await expect(callFunc).rejects.toThrow(ResponseError);
      await expect(callFunc).rejects.toThrow(
        "You cannot bid on your own listing"
      );
    });
    it("Throws error bid amount is below minimum", async () => {
      // Arrange
      const userId = "111111111111111111111112";
      const payload = { amount: 1234 };
      const runningListing: IListingFragment = {
        ...fragmentToReturn,
        startsOn: dayjs().subtract(1, "day").toDate(),
      };
      mockedFragmentRepo.getListingFragmentById.mockResolvedValue(
        runningListing
      );
      mockedBidRepo.getBidsByListingId.mockResolvedValue([]);

      // Act
      const callFunc = async () => {
        await postBid(userId, fragmentToReturn._id.toString(), payload);
      };

      // Assert
      await expect(callFunc).rejects.toThrow(ResponseError);
      await expect(callFunc).rejects.toThrow(
        "Bid is not above the minimum amount"
      );
    });
    it("Throws error bid amount is below minimum", async () => {
      // Arrange
      const userId = "111111111111111111111112";
      const payload = { amount: 10500 };
      const runningListing: IListingFragment = {
        ...fragmentToReturn,
        startsOn: dayjs().subtract(1, "day").toDate(),
      };
      const bidToReturn: IBid = {
        _id: new Types.ObjectId(userId),
        amount: 11000,
        listingId: fragmentToReturn._id,
        createdAt: dayjs().toDate(),
        creatorId: new Types.ObjectId(userId),
      };
      mockedFragmentRepo.getListingFragmentById.mockResolvedValue(
        runningListing
      );
      mockedBidRepo.getBidsByListingId.mockResolvedValue([bidToReturn]);

      // Act
      const callFunc = async () => {
        await postBid(userId, fragmentToReturn._id.toString(), payload);
      };

      // Assert
      await expect(callFunc).rejects.toThrow(ResponseError);
      await expect(callFunc).rejects.toThrow(
        "Bid is less than the current highest bid"
      );
    });
    it("Returns created bid", async () => {
      // Arrange
      const userId = "111111111111111111111112";
      const payload = { amount: 10500 };
      const runningListing: IListingFragment = {
        ...fragmentToReturn,
        startsOn: dayjs().subtract(1, "day").toDate(),
      };
      const bidToReturn: IBid = {
        _id: new Types.ObjectId(userId),
        amount: 10500,
        listingId: fragmentToReturn._id,
        createdAt: dayjs().toDate(),
        creatorId: new Types.ObjectId(userId),
      };
      mockedFragmentRepo.getListingFragmentById.mockResolvedValue(
        runningListing
      );
      mockedBidRepo.getBidsByListingId.mockResolvedValue([]);
      mockedBidRepo.createBid.mockResolvedValue(bidToReturn);

      // Act

      const result = await postBid(
        userId,
        fragmentToReturn._id.toString(),
        payload
      );

      // Assert
      expect(mockedFragmentRepo.getListingFragmentById).toBeCalledWith(
        runningListing._id.toString()
      );
      expect(mockedBidRepo.getBidsByListingId).toBeCalledWith(
        runningListing._id.toString()
      );
      expect(mockedBidRepo.createBid).toBeCalledWith(
        userId, runningListing._id.toString(), payload
      );
      expect(result).toMatchObject(bidToReturn);
    });
  });
});
