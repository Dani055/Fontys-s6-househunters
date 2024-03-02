import { CommentDTO } from "./commentDTO";
import { BaseDTO, WithCreator } from './baseDTO';

export interface ListingDTO extends BaseDTO, WithCreator {
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
  comments?: CommentDTO[];
}