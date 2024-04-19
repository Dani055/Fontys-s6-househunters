import { Types } from 'mongoose';

export interface IBase {
    _id: Types.ObjectId;
    creatorId: Types.ObjectId | null;
}