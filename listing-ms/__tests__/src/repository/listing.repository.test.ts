import app from "listing-ms/index";
import mongoose, { Types } from "mongoose";
import dayjs from "dayjs";
import { createListingPayload } from "shared/requests/req";
import {
  assignListingPhotos,
  createListing,
  deleteListing,
  editListing,
  getListingbyId,
} from "listing-ms/src/repository/listing.repository";
import { IListing } from "listing-ms/src/models/Listing";
import { ResponseError } from "shared/responses/responseError";

// Wait for app to fully start. For some reason the tests do not wait for it otherwise
beforeAll((done) => {
  app.on("appStarted", () => done());
});
afterAll(async () => {
  await mongoose.disconnect();
});
let createdListingId: string;
const startsOn = dayjs().toDate();
const endsOn = dayjs().toDate();
const userId = "111111111111111111111111";

describe("Listing repository", () => {
  describe("createListing", () => {
    it("Creates listing successfully", async () => {
      // Arrange
      const base = {
        propertyType: "Listing for integration tests",
        buildYear: 2000,
        size: 20,
        listingDescription: "Listing used for CRUD tests",
        startingPrice: 10,
        buyoutPrice: 20,
        location: "Eindhoven",
        startsOn,
        endsOn,
      };
      const payload: createListingPayload = {
        ...base,
        newImages: false,
      };
      const expectedListing = {
        ...base,
        creatorId: new Types.ObjectId(userId),
        hasSold: false,
        comments: [],
        images: [],
      };

      // Act
      const createdListing = await createListing(userId, payload);
      createdListingId = createdListing._id.toString();

      // Assert
      expect(createdListing).toMatchObject(expectedListing);
    });
  });
  describe("editListing", () => {
    it("Edits listing successfully", async () => {
      // Arrange
      const base = {
        propertyType: "Edited listing",
        buildYear: 2005,
        size: 25,
        listingDescription: "Edited listing used for CRUD tests",
        startingPrice: 20,
        buyoutPrice: 30,
        location: "The Moon",
        startsOn,
        endsOn,
      };
      const payload: createListingPayload = {
        ...base,
        newImages: false,
      };
      const expectedListing: IListing = {
        ...base,
        creatorId: new Types.ObjectId(userId),
        hasSold: false,
        comments: [],
        images: [],
        _id: new Types.ObjectId(createdListingId),
      };

      // Act
      const editedListing = await editListing(createdListingId, payload);

      // Assert
      expect(editedListing.imagesToDelete).toMatchObject([]);
      expect(editedListing.listing).toMatchObject(expectedListing);
    });
  });
  describe("assignListingPhotos", () => {
    it("Changes listing images successfully", async () => {
      // Arrange
      // Act
      const editedListing = await assignListingPhotos(createdListingId, [
        "img123",
      ]);

      // Assert
      expect(editedListing.images).toEqual(["img123"]);
    });
  });
  describe("getListingById", () => {
    it("Gets listing successfully", async () => {
      // Arrange
      const expectedListing: IListing = {
        _id: new Types.ObjectId(createdListingId),
        creatorId: new Types.ObjectId(userId),
        hasSold: false,
        comments: [],
        images: ["img123"],
        propertyType: "Edited listing",
        buildYear: 2005,
        size: 25,
        listingDescription: "Edited listing used for CRUD tests",
        startingPrice: 20,
        buyoutPrice: 30,
        location: "The Moon",
        startsOn,
        endsOn,
      };

      // Act
      const listing = await getListingbyId(createdListingId);

      // Assert
      expect(listing).toMatchObject(expectedListing);
    });
    it("Throws error when listing is not found", async () => {
        // Arrange

      // Act
      const callFunc = async () => {
        await getListingbyId("119872111111111111111111"
        );
      };

      // Assert
      await expect(callFunc).rejects.toThrow(ResponseError);
      await expect(callFunc).rejects.toThrow(
        "Listing with specified id not found"
      );
      });
  });
  describe("deleteListing", () => {
    it("Deletes listing successfully", async () => {
        // Arrange

      // Act
      const result = await deleteListing(createdListingId);

      // Assert
      expect(result).toEqual(true);
    });
  });
});
