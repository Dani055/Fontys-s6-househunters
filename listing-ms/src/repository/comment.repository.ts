import { createCommentPayload } from "shared/requests/req";
import CommentEntity, { IComment } from "../models/Comment";
import ListingEntity from "../models/Listing";
import { ResponseError } from "shared/responses/responseError";

export const createComment = async (userId: string, listingId: string, payload: createCommentPayload) => {
    const [listing, comment] = await Promise.all([
        ListingEntity.findById(listingId).orFail(),
        CommentEntity.create({ ...payload, creatorId: userId, listingId: listingId })
    ])
    listing.comments.push(comment);
    listing.save();
    return comment as IComment
};
export const deleteComment = async (commentId: string) => {
    const comment = await getCommentById(commentId);
    const listing = await ListingEntity.findById(comment.listingId);
    if (listing) {
        const indexOfComment = listing.comments.findIndex(c => c.toString() === comment._id.toString());
        listing.comments.splice(indexOfComment, 1);
        await Promise.all([
            listing.save(),
            CommentEntity.deleteOne({ _id: commentId })
        ])
    }
    else{
        await CommentEntity.deleteOne({ _id: commentId });
    }
    return true;
};
export const getCommentById = async (commentId: string) => {
    const comment = await CommentEntity.findById(commentId)
    if (!comment) {
        throw new ResponseError(404, 'Comment with specified id not found')
    }
    return comment as IComment;
};