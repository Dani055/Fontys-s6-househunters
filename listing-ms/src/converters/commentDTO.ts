import { CommentDTO } from "shared/dtos/commentDTO"
import { IComment } from "../models/Comment";

export function mapCommentToDTO(comment: IComment): CommentDTO {
    const commentDto: CommentDTO = {
        _id: comment._id.toString(),
        text: comment.text,
        creatorId: comment.creatorId ? comment.creatorId.toString() : null,
        listingId: comment.listingId.toString(),
        createdAt: comment.createdAt
    }
    return commentDto;
}