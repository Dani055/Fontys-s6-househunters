import { RequestHandler } from 'express';
import { mapCommentToDTO } from 'listing-ms/src/converters/commentDTO';
import { createCommentPayload } from 'shared/requests/req';
import { CommentDtoResponse } from 'shared/responses/res';
import { postComment, removeComment } from '../services/comment.service';


export const handleCreateComment: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.userId;
    const listingId = req.query.listingId as string;
    const commentInfo: createCommentPayload = req.body
    const comment = await postComment(userId, listingId, commentInfo);
    const commentDto = mapCommentToDTO(comment);

    const response: CommentDtoResponse = {
      message: 'Comment created',
      comment: commentDto
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
export const handleRemoveComment: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.userId;
    const commentId = req.params.commentId as string;
    await removeComment(userId, req.userRoles, commentId);

    const response = {
      message: 'Comment deleted'
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};