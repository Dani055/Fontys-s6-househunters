import { ResponseError } from 'shared/responses/responseError';
import { deleteUserById, findUserByUsername } from '../repository/auth.repository';
import { hasRequiredRoles } from 'shared/functions/hasRequiredRoles'

export const getUserByUsername = async (username: string) => {
    return await findUserByUsername(username);
};
export const deleteUserAccount = async (targetId: string, userId: string, userRoles: string[]) => {
    if(userId !== targetId && !hasRequiredRoles(userRoles, ['Admin'])){
        throw new ResponseError(401, "You are not authorized to delete this account")
    }
    return deleteUserById(targetId);
};