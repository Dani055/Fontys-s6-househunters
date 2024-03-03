import { Schema, model, Types } from 'mongoose';
import { IBase } from 'shared/interfaces/modelBase';

export interface IListingFragment extends IBase{
  startingPrice: number
  buyoutPrice: number
  startsOn: Date
  endsOn: Date
}

const listingSchema = new Schema<IListingFragment>({
  startingPrice: {
    type: Schema.Types.Number,
    required: true,
  },
  buyoutPrice: {
    type: Schema.Types.Number,
    required: true,
  },
  startsOn: {
    type: Schema.Types.Date,
    required: true
  },
  endsOn: {
    type: Schema.Types.Date,
    required: true
  },
  creatorId: {
    type: Schema.Types.ObjectId,
    required: true
  }
}, { versionKey: false, timestamps: true });
const ListingFragmentEntity = model<IListingFragment>('ListingFragment', listingSchema);

export default ListingFragmentEntity;