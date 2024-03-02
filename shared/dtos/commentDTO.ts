import { BaseDTO, WithCreator} from './baseDTO';

export interface CommentDTO extends BaseDTO, WithCreator{
    text: string,
    listingId: string,
    createdAt: Date,
}