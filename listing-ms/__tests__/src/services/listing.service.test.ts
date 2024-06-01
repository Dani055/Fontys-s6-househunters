import app from "listing-ms/index";
import mongoose, { Types } from "mongoose";

import * as listingRepo from "listing-ms/src/repository/listing.repository";
import { listingPayload2, listingToReturn } from "listing-ms/jest/dummyData";
import { changeListing, removeListing } from "listing-ms/src/services/listing.service";
import { ResponseError } from "shared/responses/responseError";
import { IListing } from "listing-ms/src/models/Listing";
import dayjs from "dayjs";

// Wait for app to fully start. For some reason the tests do not wait for it otherwise
beforeAll((done) => {
  app.on("appStarted", () => done());
});
afterAll(async () => {
  await mongoose.disconnect();
});

jest.mock("listing-ms/src/repository/listing.repository", () => {
  const original = jest.requireActual(
    "listing-ms/src/repository/listing.repository"
  );
  return {
    ...original,
    _esModule: true,
    createListing: jest.fn(),
    getListingbyId: jest.fn(),
    editListing: jest.fn(),
    deleteListing: jest.fn(),
  };
});
const mockedRepo = listingRepo as jest.Mocked<typeof listingRepo>;

describe("Listing service", () => {
  describe("changeListing", () => {
    it("Throws error when user is not owner", async () => {
      // Arrange
      const userId = "111111111111111111111112";
      const roles = ["User"];
      mockedRepo.getListingbyId.mockResolvedValue(listingToReturn);

      // Act
      const callFunc = async () => {
        await changeListing(
          userId,
          roles,
          listingPayload2,
          listingToReturn._id.toString()
        );
      };

      // Assert
      await expect(callFunc).rejects.toThrow(ResponseError);
      await expect(callFunc).rejects.toThrow(
        "You are not authorized to change this listing"
      );
    });
    it("Throws error when user is owner but listing has started", async () => {
      // Arrange
      const userId = "111111111111111111111111";
      const roles = ["User"];
      const startedListing: IListing = {
        ...listingToReturn,
        startsOn: dayjs().subtract(1, "day").toDate(),
      };
      mockedRepo.getListingbyId.mockResolvedValue(startedListing);

      // Act
      const callFunc = async () => {
        await changeListing(
          userId,
          roles,
          listingPayload2,
          startedListing._id.toString()
        );
      };

      // Assert
      await expect(callFunc).rejects.toThrow(ResponseError);
      await expect(callFunc).rejects.toThrow(
        "Cannot change listing info. It has already started"
      );
    });
    it("Returns edited listing", async () => {
      // Arrange
      const userId = "111111111111111111111111";
      const roles = ["User"];

      mockedRepo.getListingbyId.mockResolvedValue(listingToReturn);
      mockedRepo.editListing.mockResolvedValue(listingToReturn);

      // Act
      const result = await changeListing(
        userId,
        roles,
        listingPayload2,
        listingToReturn._id.toString()
      );

      // Assert
    expect(result).toMatchObject(listingToReturn)
    });
  });
  describe("removeListing", () => {
    it("Throws error when user is not owner", async () => {
      // Arrange
      const userId = "111111111111111111111112";
      const roles = ["User"];
      mockedRepo.getListingbyId.mockResolvedValue(listingToReturn);

      // Act
      const callFunc = async () => {
        await removeListing(
          userId,
          roles,
          listingToReturn._id.toString()
        );
      };

      // Assert
      await expect(callFunc).rejects.toThrow(ResponseError);
      await expect(callFunc).rejects.toThrow(
        "You are not authorized to delete this listing"
      );
    });
    it("Throws error when user is owner but listing has started", async () => {
      // Arrange
      const userId = "111111111111111111111111";
      const roles = ["User"];
      const startedListing: IListing = {
        ...listingToReturn,
        startsOn: dayjs().subtract(1, "day").toDate(),
      };
      mockedRepo.getListingbyId.mockResolvedValue(startedListing);

      // Act
      const callFunc = async () => {
        await removeListing(
          userId,
          roles,
          startedListing._id.toString()
        );
      };

      // Assert
      await expect(callFunc).rejects.toThrow(ResponseError);
      await expect(callFunc).rejects.toThrow(
        "Cannot delete listing. It has already started"
      );
    });
    it("Returns images to delete from deleted listing", async () => {
      // Arrange
      const userId = "111111111111111111111111";
      const roles = ["User"];
      const listingWImages: IListing = {
        ...listingToReturn,
        images: ['image123']
      };
      mockedRepo.getListingbyId.mockResolvedValue(listingWImages);
      mockedRepo.deleteListing.mockResolvedValue(true);

      // Act
      const result = await removeListing(
        userId,
        roles,
        listingToReturn._id.toString()
      );

      // Assert
      expect(mockedRepo.deleteListing).toBeCalledWith(
        listingWImages,
        listingToReturn._id.toString()
      );
      expect(result).toEqual(true)
    });
  });
});
