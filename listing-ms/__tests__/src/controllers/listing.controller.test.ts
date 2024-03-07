import app from "listing-ms/index";
import mongoose, { Types } from "mongoose";
import request from "supertest";
import * as listingService from "listing-ms/src/services/listing.service";
import { mockJwt } from "listing-ms/jest/common";
import * as isAuth from "shared/middleware/is-auth";
import { listingPayload, userForJwt } from "listing-ms/jest/dummyData";
import { IListing } from "listing-ms/src/models/Listing";
import { IComment } from "listing-ms/src/models/Comment";
import dayjs from "dayjs";

// Wait for app to fully start. For some reason the tests do not wait for it otherwise
beforeAll((done) => {
  app.on("appStarted", () => done());
});
afterAll(async () => {
  await mongoose.disconnect();
});

jest.mock("listing-ms/src/services/listing.service", () => {
  const original = jest.requireActual(
    "listing-ms/src/services/listing.service"
  );
  return {
    ...original,
    _esModule: true,
    postListing: jest.fn(),
    changeListing: jest.fn(),
    removeListing: jest.fn(),
    getListings: jest.fn(),
    getListingDetails: jest.fn(),
  };
});
jest.mock("shared/middleware/is-auth", () => {
  return {
    isAuth: jest.fn(),
  };
});

const mockedService = listingService as jest.Mocked<typeof listingService>;
const mockedJwt = isAuth as jest.Mocked<typeof isAuth>;

describe("Listing controller", () => {
  describe("handleCreateListing", () => {
    it("Returns created listing", async () => {
      // Arrange
      const listingToReturn: IListing = {
        ...listingPayload,
        _id: new Types.ObjectId("211111111111111111111111"),
        hasSold: false,
        startsOn: new Date(listingPayload.startsOn),
        endsOn: new Date(listingPayload.endsOn),
        images: [],
        comments: [],
        creatorId: new Types.ObjectId("111111111111111111111111"),
      };
      const expectedDto = {
        ...listingToReturn,
        startsOn: listingPayload.startsOn,
        endsOn: listingPayload.endsOn,
        newImages: undefined,
        _id: listingToReturn._id.toString(),
        creatorId: listingToReturn.creatorId.toString(),
      };
      mockedService.postListing.mockResolvedValue(listingToReturn);
      mockJwt(mockedJwt, userForJwt);

      // Act
      const res = await request(app)
        .post("/api/listing")
        .set("Content-Type", "application/json")
        .send(listingPayload);
      // Assert
      expect(mockedService.postListing).toBeCalledWith(
        userForJwt._id,
        listingPayload
      );
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        message: "Listing created",
        listing: expectedDto,
      });
    });
  });
  describe("handleChangeListing", () => {
    it("Returns edited listing", async () => {
      // Arrange
      const payload = { ...listingPayload, _id: "211111111111111111111111" };
      const listingToReturn: IListing = {
        ...listingPayload,
        _id: new Types.ObjectId(payload._id),
        hasSold: false,
        startsOn: new Date(listingPayload.startsOn),
        endsOn: new Date(listingPayload.endsOn),
        images: [],
        comments: [],
        creatorId: new Types.ObjectId("111111111111111111111111"),
      };
      const expectedDto = {
        ...listingToReturn,
        startsOn: listingPayload.startsOn,
        endsOn: listingPayload.endsOn,
        newImages: undefined,
        _id: listingToReturn._id.toString(),
        creatorId: listingToReturn.creatorId.toString(),
      };
      mockedService.changeListing.mockResolvedValue({
        imagesToDelete: [],
        listing: listingToReturn,
      });
      mockJwt(mockedJwt, userForJwt);

      // Act
      const res = await request(app)
        .put(`/api/listing/${payload._id}`)
        .set("Content-Type", "application/json")
        .send(payload);
      // Assert
      expect(mockedService.changeListing).toBeCalledWith(
        userForJwt._id,
        userForJwt.roles,
        payload,
        payload._id
      );
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        message: "Listing edited",
        listing: expectedDto,
      });
    });
  });
  describe("handleRemoveListing", () => {
    it("Returns success", async () => {
      // Arrange
      const id = "211111111111111111111111";

      mockedService.removeListing.mockResolvedValue([]);
      mockJwt(mockedJwt, userForJwt);

      // Act
      const res = await request(app)
        .delete(`/api/listing/${id}`)
        .set("Content-Type", "application/json")
        .send();
      // Assert
      expect(mockedService.removeListing).toBeCalledWith(
        userForJwt._id,
        userForJwt.roles,
        id
      );
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ message: "Listing deleted" });
    });
  });
  describe("handleGetListings", () => {
    it("Returns listing array", async () => {
      // Arrange
      const id = "211111111111111111111111";
      const listingsToReturn: IListing[] = [
        {
          ...listingPayload,
          _id: new Types.ObjectId(id),
          hasSold: false,
          startsOn: new Date(listingPayload.startsOn),
          endsOn: new Date(listingPayload.endsOn),
          images: [],
          comments: [],
          creatorId: new Types.ObjectId("111111111111111111111111"),
        },
      ];
      const expectedDtos = [
        {
          ...listingsToReturn[0],
          startsOn: listingPayload.startsOn,
          endsOn: listingPayload.endsOn,
          newImages: undefined,
          _id: listingsToReturn[0]._id.toString(),
          creatorId: listingsToReturn[0].creatorId.toString(),
        },
      ];
      mockedService.getListings.mockResolvedValue({
        listings: listingsToReturn,
        totalPages: 2,
        totalHits: 4,
        currentPage: 0,
      });
      mockJwt(mockedJwt, userForJwt);

      // Act
      const res = await request(app).get(`/api/listing`);
      // Assert
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        message: "Listings fetched",
        listings: expectedDtos,
        currentPage: 0,
        totalPages: 2,
        totalHist: 4,
      });
    });
  });
  describe("handleGetListingDetails", () => {
    it("Returns listing details", async () => {
      // Arrange
      const listingId = "211111111111111111111111";
      const creatorid = userForJwt._id;
      const now = dayjs();

      const listingToReturn: IListing = {
        ...listingPayload,
        _id: new Types.ObjectId(listingId),
        hasSold: false,
        startsOn: new Date(listingPayload.startsOn),
        endsOn: new Date(listingPayload.endsOn),
        images: [],
        comments: [],
        creatorId: new Types.ObjectId("111111111111111111111111"),
      };
  
      const expectedDto = {
        ...listingToReturn,
        startsOn: listingPayload.startsOn,
        endsOn: listingPayload.endsOn,
        newImages: undefined,
        _id: listingId,
        creatorId: creatorid,
      };
      mockedService.getListingDetails.mockResolvedValue(listingToReturn);
      // Act
      const res = await request(app).get(`/api/listing/${listingId}`);
      // Assert
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        message: "Listing fetched",
        listing: expectedDto,
      });
    });
  });
});


