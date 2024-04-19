import { RequestHandler } from 'express';
import { mapUserToUserDTO } from 'auth-ms/src/converters/userDTO';
import { deleteUserAccount, getUserByUsername } from 'auth-ms/src/services/user.service';
import { UserDtoResponse } from 'shared/responses/res';
import { getUsersByIdBulk } from '../repository/auth.repository';
import { UserDTO } from 'shared/dtos/userDTO';

export const handleGetUserByUsername: RequestHandler = async (req, res, next) => {
    try {
      const username = req.params.username;
      const user = await getUserByUsername(username);
      const dto = mapUserToUserDTO(user);
  
      const response: UserDtoResponse = {
        message: 'Fetched user profile',
        user: dto
      }
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
};
export const handleGetUsersBulk: RequestHandler = async (req, res, next) => {
  try {
    const {ids} = req.body;
    const users = await getUsersByIdBulk(ids);
    const userDtos: { [id: string]: UserDTO } = Object.fromEntries(
      users.map(user => {
        const dto = mapUserToUserDTO(user);
        return [dto._id, dto]
      })
    );
    const response = {
      message: 'Users fetched',
      userIdToUser: userDtos
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
export const handleDeleteUser: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await deleteUserAccount(userId, req.userId, req.userRoles);
    const response = {
      message: 'Account deleted'
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};