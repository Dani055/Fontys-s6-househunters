import app from "listing-ms/index";
import mongoose, { Types } from "mongoose";

import * as listingRepo from "listing-ms/src/repository/listing.repository";
import * as commentRepo from "listing-ms/src/repository/comment.repository";
import {
  commentToReturn,
  listingPayload2,
  listingToReturn,
} from "listing-ms/jest/dummyData";
import {
  changeListing,
  removeListing,
} from "listing-ms/src/services/listing.service";
import { ResponseError } from "shared/responses/responseError";
import { IListing } from "listing-ms/src/models/Listing";
import dayjs from "dayjs";
import {
  postComment,
  removeComment,
} from "listing-ms/src/services/comment.service";
import { IComment } from "listing-ms/src/models/Comment";

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
    getListingbyId: jest.fn(),
  };
});
jest.mock("listing-ms/src/repository/comment.repository", () => {
  const original = jest.requireActual(
    "listing-ms/src/repository/comment.repository"
  );
  return {
    ...original,
    _esModule: true,
    createComment: jest.fn(),
    deleteComment: jest.fn(),
    getCommentById: jest.fn()
  };
});
const mockedListingRepo = listingRepo as jest.Mocked<typeof listingRepo>;
const mockedCommentRepo = commentRepo as jest.Mocked<typeof commentRepo>;

describe("Comment service", () => {
  describe("postComment", () => {
    it("Throws error when listing has ended", async () => {
      // Arrange
      const userId = "111111111111111111111111";
      const expiredListing: IListing = {
        ...listingToReturn,
        endsOn: dayjs().subtract(1, "day").toDate(),
      };
      const payload = { text: "comment" };
      mockedListingRepo.getListingbyId.mockResolvedValue(expiredListing);

      // Act
      const callFunc = async () => {
        await postComment(userId, expiredListing._id.toString(), payload);
      };

      // Assert
      await expect(callFunc).rejects.toThrow(ResponseError);
      await expect(callFunc).rejects.toThrow(
        "Cannot post comment, listing has ended"
      );
    });
    it("Returns created comment", async () => {
      // Arrange
      const userId = "111111111111111111111111";
      const payload = { text: "comment" };

      mockedListingRepo.getListingbyId.mockResolvedValue(listingToReturn);
      mockedCommentRepo.createComment.mockResolvedValue(commentToReturn);

      // Act
      const result = await postComment(
        userId,
        listingToReturn._id.toString(),
        payload
      );

      // Assert
      expect(mockedListingRepo.getListingbyId).toBeCalledWith(
        listingToReturn._id.toString()
      );
      expect(mockedCommentRepo.createComment).toBeCalledWith(
        userId,
        listingToReturn._id.toString(),
        payload
      );
      expect(result).toMatchObject(commentToReturn);
    });
  });
  describe("removeComment", () => {
    it("Throws error when user is not owner", async () => {
      // Arrange
      const userId = "111111111111111111111112";
      const roles = ["User"];
      mockedCommentRepo.getCommentById.mockResolvedValue(commentToReturn);

      // Act
      const callFunc = async () => {
        await removeComment(userId, roles, commentToReturn._id.toString());
      };

      // Assert
      await expect(callFunc).rejects.toThrow(ResponseError);
      await expect(callFunc).rejects.toThrow(
        "You cannot delete someone else's comment"
      );
    });
    it("Returns true when comment is deleted", async () => {
      // Arrange
      const userId = "111111111111111111111111";
      const roles = ["User"];

      mockedCommentRepo.getCommentById.mockResolvedValue(commentToReturn);
      mockedCommentRepo.deleteComment.mockResolvedValue(true);

      // Act
      const result = await removeComment(
        userId,
        roles,
        commentToReturn._id.toString()
      );

      // Assert
      expect(mockedCommentRepo.getCommentById).toBeCalledWith(
        commentToReturn._id.toString()
      );
      expect(mockedCommentRepo.deleteComment).toBeCalledWith(
        commentToReturn._id.toString()
      );
      expect(result).toEqual(true);
    });
  });
});
