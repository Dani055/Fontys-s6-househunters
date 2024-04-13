import { Schema, model, Types } from 'mongoose';
import { IComment, } from './Comment';
import { IBase } from 'shared/interfaces/modelBase';

export interface IListing extends IBase{
  propertyType: string
  buildYear: number
  listingDescription?: string
  size: number
  startingPrice: number
  buyoutPrice: number
  hasSold: boolean
  location: string
  startsOn: Date
  endsOn: Date
  images: string[]
  comments?: IComment[];
}

const listingSchema = new Schema<IListing>({
  propertyType: {
    type: Schema.Types.String,
    required: true,
  },
  listingDescription: {
    type: Schema.Types.String,
  },
  buildYear: {
    type: Schema.Types.Number,
    required: true,
  },
  size: {
    type: Schema.Types.Number,
    required: true,
  },
  startingPrice: {
    type: Schema.Types.Number,
    required: true,
  },
  buyoutPrice: {
    type: Schema.Types.Number,
    required: true,
  },
  hasSold: {
    type: Schema.Types.Boolean,
    default: false,
  },
  location: {
    type: Schema.Types.String,
    required: true
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
  },
  images: [{
    type: Schema.Types.String
  }]
}, { versionKey: false, timestamps: true });
const ListingEntity = model<IListing>('Listing', listingSchema);

export default ListingEntity;