import { BaseDTO, WithCreator} from './baseDTO';

export interface BidDTO extends BaseDTO, WithCreator{
    listingId: string,
    amount: number,
    createdAt: Date,
}