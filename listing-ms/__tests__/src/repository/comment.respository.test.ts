import app from "listing-ms/index";
import mongoose, { Types } from "mongoose";
import { createCommentPayload } from "shared/requests/req";
import { ResponseError } from "shared/responses/responseError";
import { listingForCommentsTests } from "listing-ms/jest/dummyData";
import { createComment, deleteComment, getCommentById } from "listing-ms/src/repository/comment.repository";

// Wait for app to fully start. For some reason the tests do not wait for it otherwise
beforeAll((done) => {
  app.on("appStarted", () => done());
});
afterAll(async () => {
  await mongoose.disconnect();
});

let createdCommentId: string;
const userId = "111111111111111111111111";

describe("Comment repository", () => {
  describe("createComment", () => {
    it("Creates comment successfully", async () => {
      // Arrange
      const payload: createCommentPayload = {
        text: "comment yes"
      };
      const expectedComment = {
        ...payload,
        creatorId: new Types.ObjectId(userId),
        listingId: listingForCommentsTests._id,
      };

      // Act
      const createdComment = await createComment(userId, listingForCommentsTests._id.toString(), payload);
      createdCommentId = createdComment._id.toString();

      // Assert
      expect(createdComment).toMatchObject(expectedComment);
    });
  });
  describe("getCommentById", () => {
    it("Gets comment successfully", async () => {
      // Arrange
      const expectedComment = {
        _id: new Types.ObjectId(createdCommentId),
        text: "comment yes",
        creatorId: new Types.ObjectId(userId),
        listingId: listingForCommentsTests._id,
      };

      // Act
      const comment = await getCommentById(createdCommentId);

      // Assert
      expect(comment).toMatchObject(comment);
    });
    it("Throws error when comment is not found", async () => {
        // Arrange

      // Act
      const callFunc = async () => {
        await getCommentById("119872111111111111111111"
        );
      };

      // Assert
      await expect(callFunc).rejects.toThrow(ResponseError);
      await expect(callFunc).rejects.toThrow(
        "Comment with specified id not found"
      );
      });
  });
  describe("deleteComment", () => {
    it("Deletes comment successfully", async () => {
        // Arrange

      // Act
      const result = await deleteComment(createdCommentId);

      // Assert
      expect(result).toEqual(true);
    });
  });
});
