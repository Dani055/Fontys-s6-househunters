import { Schema, model, Types } from 'mongoose';
import { IBase } from 'shared/interfaces/modelBase';

export interface IComment extends IBase {
  text: string;
  listingId: Types.ObjectId;
  createdAt: Date;
}
const commentSchema = new Schema<IComment>({
  text: {
    type: Schema.Types.String,
    required: true,
  },
  listingId: {
    type: Schema.Types.ObjectId,
    ref: 'Listing',
    required: true,
  },
  creatorId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Schema.Types.Date,
  }
}, { versionKey: false, timestamps: true });
const CommentEntity = model<IComment>('Comment', commentSchema);


export default CommentEntity;