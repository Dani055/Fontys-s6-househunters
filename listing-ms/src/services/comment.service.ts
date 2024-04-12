import { createCommentPayload } from 'shared/requests/req';
import { createComment, deleteComment, getCommentById } from '../repository/comment.repository';
import { getListingbyId } from '../repository/listing.repository';
import { hasListingEnded } from 'shared/functions/listingValidator';
import { ResponseError } from 'shared/responses/responseError';
import { hasRequiredRoles } from 'shared/functions/hasRequiredRoles';

export const postComment = async (userId: string, listingId: string, commentInfo: createCommentPayload) => {
    // const listing = await getListingbyId(listingId);
    // if(hasListingEnded(listing.endsOn)){
    //     throw new ResponseError(401, "Cannot post comment, listing has ended")
    // }
    return await createComment(userId, listingId, commentInfo)
};
export const removeComment = async (userId: string, userRoles: string[], commentId: string) => {
    const comment = await getCommentById(commentId);

    if(comment.creatorId.toString() !== userId && !hasRequiredRoles(userRoles, ['Admin'])){
        throw new ResponseError(401, "You cannot delete someone else's comment")
    }
    return await deleteComment(commentId);
};