import app from "bid-ms/index";
import mongoose, { Types } from "mongoose";
import { deleteListingFragment, editListingFragment, getListingFragmentById, saveListingFragment } from "bid-ms/src/repository/listingFragment.repository";
import { fragmentForIntegration, fragmentToReturn } from "bid-ms/jest/dummyData";
import dayjs from 'dayjs'
import { IListingFragment } from "bid-ms/src/models/ListingFragment";
import { ResponseError } from "shared/responses/responseError";
import BidEntity from "bid-ms/src/models/Bid";

// Wait for app to fully start. For some reason the tests do not wait for it otherwise
beforeAll((done) => {
  app.on("appStarted", () => done());
});
afterAll(async () => {
  await mongoose.disconnect();
});

let createdFragmentId: string;
const listingId = "211111111111111111111112";

describe("Listing fragment repository", () => {
  describe("saveListingFragment", () => {
    it("Returns created fragment", async () => {
      // Arrange

      // Act
      const createdFragment = await saveListingFragment(fragmentForIntegration);
      createdFragmentId = createdFragment!._id.toString();

      // Assert
      expect(createdFragment).toMatchObject(fragmentForIntegration);
    });
  });
  describe("getListingFragmentById", () => {
    it("Returns fragment", async () => {
      // Arrange

      // Act
      const fragment = await getListingFragmentById(createdFragmentId);

      // Assert
      expect(fragment).toMatchObject(fragmentForIntegration);
    });
  });
  describe("getListingFragmentById", () => {
    it("Throws error when fragment is not found", async () => {
      // Arrange

      // Act
      const callFunc = async () => {
        await getListingFragmentById("211111611111111111555111");
      };

      // Assert
      await expect(callFunc).rejects.toThrow(ResponseError);
      await expect(callFunc).rejects.toThrow(
        "Listing with specified id not found"
      );
    });
  });
  describe("editListingFragment", () => {
    it("Returns edited fragment", async () => {
      // Arrange
      const newFragmentInfo = {
        _id: new Types.ObjectId("211111111111111111555111"),
        creatorId: new Types.ObjectId("111111111111111111111119"),
        startingPrice: 5,
        buyoutPrice: 10,
        startsOn: dayjs().toDate(),
        endsOn: dayjs().toDate(),
      }
      const expectedFragment: IListingFragment = {
        ...newFragmentInfo,
        _id: new Types.ObjectId(createdFragmentId),
        creatorId: new Types.ObjectId("111111111111111111111119")
      }
      // Act
      const editedFragment = await editListingFragment(expectedFragment);

      // Assert
      expect(editedFragment).toMatchObject(expectedFragment);
    });
  });
  describe("deleteListingFragment", () => {
    it("Deleted fragment and associated bids", async () => {
      // Arrange
      // Act
      const result = await deleteListingFragment(createdFragmentId);
      const bids = await BidEntity.find({listingId: listingId})
      // Assert
      expect(result).toEqual(true);
      expect(bids).toEqual([]);
    });
  });
});
