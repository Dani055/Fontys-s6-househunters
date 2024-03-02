import { BaseDTO } from "./baseDTO";
import { CommentDTO } from "./commentDTO";

export interface UserDTO extends BaseDTO{
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    roles: string[];
    comments?: CommentDTO[];
}