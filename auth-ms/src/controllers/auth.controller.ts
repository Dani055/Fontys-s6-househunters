import { getUserById, loginUser, registerUser } from 'auth-ms/src/services/auth.service';
import { mapUserToUserDTO } from 'auth-ms/src/converters/userDTO';
import { registerUserPayload } from 'shared/requests/req'
import { LoginResponse, UserDtoResponse } from 'shared/responses/res'
import { RequestHandler } from 'express';
import { ResponseError } from 'shared/responses/responseError';

export const handleLogin: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await loginUser(email, password);
    const response: LoginResponse = {
      message: 'User successfully logged in!',
      token: token
    }
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
export const handleRegister: RequestHandler = async (req, res, next) => {
  try {
    const userInfo : registerUserPayload = req.body;
    const user = await registerUser(userInfo);
    const dto = mapUserToUserDTO(user);
  
    const response: UserDtoResponse = {
      message: 'User successfully registered',
      user: dto
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
export const handleGetuserByToken: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await getUserById(userId)
    const dto = mapUserToUserDTO(user)

    const response: UserDtoResponse = {
      message: 'User fetched',
      user: dto
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
