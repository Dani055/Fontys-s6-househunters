import { createCommentPayload } from "shared/requests/req";
import CommentEntity, { IComment } from "../models/Comment";
import { ResponseError } from "shared/responses/responseError";

export const createComment = async (userId: string, listingId: string, payload: createCommentPayload) => {
    return CommentEntity.create({ ...payload, creatorId: userId, listingId: listingId }) as Promise<IComment>
};
export const getCommentsByListingId = async (listingId: string) => {
    return CommentEntity.find({listingId: listingId}) as Promise<IComment[]>
}
export const deleteComment = async (commentId: string) => {
    await CommentEntity.deleteOne({ _id: commentId });
    return true;
};
export const getCommentById = async (commentId: string) => {
    const comment = await CommentEntity.findById(commentId)
    if (!comment) {
        throw new ResponseError(404, 'Comment with specified id not found')
    }
    return comment as IComment;
};