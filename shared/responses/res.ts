import { UserDTO } from "../dtos/userDTO";
import { BaseResponse } from "./baseResponse";
import { CommentDTO } from "../dtos/commentDTO";
import { BidDTO } from "shared/dtos/bidDTO";

export interface LoginResponse extends BaseResponse{
    token: string,
}
export interface UserDtoResponse extends BaseResponse{
    user: UserDTO,
}
export interface CommentDtoResponse extends BaseResponse{
    comment: CommentDTO,
}
export interface BidDtoResponse extends BaseResponse{
    bid: BidDTO,
}
