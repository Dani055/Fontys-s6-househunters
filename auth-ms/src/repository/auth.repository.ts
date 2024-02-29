import { ResponseError } from 'shared/responses/responseError';
import UserEntity, { IUser, } from '../models/User';
import { registerUserPayload } from 'shared/requests/req';

export const findUserByEmail = async (email: string) => {
    const user = await UserEntity.findOne({ email })
    return user as IUser | null
};
export const findUserByUsername = async (username: string) => {
    const user = await UserEntity.findOne({ username })
    if(!user){
        throw new ResponseError(404, "User with specified username was not found")
    }
    return user as IUser
};
export const createUser = async (user: registerUserPayload) => {
    const result = await UserEntity.create({...user, roles: ['User']})
    return result as IUser
};
export const findUserById = async (id: string) => {
    const user = await UserEntity.findById(id)
    if(!user){
        throw new ResponseError(404, "User with specified id was not found")
    }
    return user as IUser
};
export const getUsersByIdBulk = async (ids: string[]) => {
    const users = await UserEntity.find({_id: {$in: ids}})
    return users as IUser[]
};