import { Schema, model, Types } from 'mongoose';
import { IBase } from 'shared/interfaces/modelBase';

export interface IBid extends IBase {
  listingId: Types.ObjectId;
  amount: number
  createdAt: Date
}
const bidSchema = new Schema<IBid>({
  creatorId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  listingId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  amount: {
    type: Schema.Types.Number,
    required: true,
  },
  createdAt: {
    type: Schema.Types.Date,
  }
}, { versionKey: false, timestamps: true });

const BidEntity = model<IBid>('Bid', bidSchema);


export default BidEntity;