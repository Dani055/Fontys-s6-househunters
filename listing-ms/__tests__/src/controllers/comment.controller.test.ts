import app from "listing-ms/index";
import mongoose, { Types } from "mongoose";
import request from "supertest";
import * as commentService from "listing-ms/src/services/comment.service";
import { mockJwt } from "listing-ms/jest/common";
import * as isAuth from "shared/middleware/is-auth";
import { userForJwt } from "listing-ms/jest/dummyData";
import { IComment } from "listing-ms/src/models/Comment";
import dayjs from "dayjs";

// Wait for app to fully start. For some reason the tests do not wait for it otherwise
beforeAll((done) => {
  app.on("appStarted", () => done());
});
afterAll(async () => {
  await mongoose.disconnect();
});

jest.mock("listing-ms/src/services/comment.service", () => {
  const original = jest.requireActual(
    "listing-ms/src/services/comment.service"
  );
  return {
    ...original,
    _esModule: true,
    postComment: jest.fn(),
    removeComment: jest.fn(),
  };
});
jest.mock("shared/middleware/is-auth", () => {
  return {
    isAuth: jest.fn(),
  };
});

const mockedService = commentService as jest.Mocked<typeof commentService>;
const mockedJwt = isAuth as jest.Mocked<typeof isAuth>;

describe("Comment controller", () => {
  describe("handleCreateComment", () => {
    it("Returns created comment", async () => {
            // Arrange
            const listingId = "211111111111111111111111";
            const creatorid = userForJwt._id;
            const commentId = "311111111111111111111111";
            const now = dayjs();
        
            const commentToReturn: IComment = {
              _id: new Types.ObjectId(commentId),
              text: "asd",
              listingId: new Types.ObjectId(listingId),
              createdAt: now.toDate(),
              creatorId: new Types.ObjectId(creatorid),
            };
            const expectedDto = {
              _id: commentId,
              text: "asd",
              createdAt: now.toISOString(),
              listingId: listingId,
              creatorId: creatorid,
            }
            
            mockedService.postComment.mockResolvedValue(commentToReturn);
            mockJwt(mockedJwt, userForJwt);
      
            // Act
            const res = await request(app)
              .post(`/api/comment?listingId=${listingId}`)
              .set("Content-Type", "application/json")
              .send({text: "asd"});
            // Assert
            expect(mockedService.postComment).toBeCalledWith(
              creatorid,
              listingId,
              {text: "asd"}
            );
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({
              message: "Comment created",
              comment: expectedDto,
            });
    });
  });
  describe("handleRemoveComment", () => {
    it("Returns success", async () => {
      // Arrange
      const id = "311111111111111111111111";

      mockedService.removeComment.mockResolvedValue(true);
      mockJwt(mockedJwt, userForJwt);

      // Act
      const res = await request(app)
        .delete(`/api/comment/${id}`)
        .set("Content-Type", "application/json")
        .send();
      // Assert
      expect(mockedService.removeComment).toBeCalledWith(
        userForJwt._id,
        userForJwt.roles,
        id
      );
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ message: "Comment deleted" });
    });
  });
});
