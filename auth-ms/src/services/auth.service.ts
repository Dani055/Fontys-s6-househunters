import { createUser, findUserByEmail, findUserById } from '../repository/auth.repository';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { registerUserPayload } from 'shared/requests/req';
import { ResponseError } from 'shared/responses/responseError';

export const loginUser = async (email: string, password: string): Promise<string> => {
    const user = await findUserByEmail(email);
    if (!user) {
        throw new ResponseError(404, 'Wrong email or password!');
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if(!matchPassword){
        throw new ResponseError(404, 'Wrong email or password!');
    }
    const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');
    const payload = {
        sub: user._id,
        email: user.email,
        roles: user.roles
    }
    const token = await jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '5h' });
    return token;
};
export const registerUser = async (user: registerUserPayload) => {
    user.password = await bcrypt.hash(user.password, 10)
    const result = await createUser(user);
    return result
};
export const getUserById = async (id: string) => {
    return await findUserById(id);
};