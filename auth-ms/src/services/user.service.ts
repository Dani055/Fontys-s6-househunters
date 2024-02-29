import { findUserByUsername } from '../repository/auth.repository';

export const getUserByUsername = async (username: string) => {
    return await findUserByUsername(username);
};