import app from "auth-ms/index";
import request from "supertest";
import * as userService from 'auth-ms/src/services/user.service';
import * as userRepo from 'auth-ms/src/repository/auth.repository';

import { userForReturning } from "auth-ms/jest/dummyData";

// Wait for app to fully start. For some reason the tests do not wait for it otherwise
beforeAll((done) => {
    app.on("appStarted", () => done())
});

jest.mock('auth-ms/src/services/user.service', () => {
    const original = jest.requireActual('auth-ms/src/services/user.service')
    return {
        ...original,
        _esModule: true,
        getUserByUsername: jest.fn(),
    }
})
jest.mock('auth-ms/src/repository/auth.repository', () => {
    const original = jest.requireActual('auth-ms/src/repository/auth.repository')
    return {
        ...original,
        _esModule: true,
        getUsersByIdBulk: jest.fn(),
    }
})

const mockedService = userService as jest.Mocked<typeof userService>;
const mockedRepo = userRepo as jest.Mocked<typeof userRepo>;

describe('User controller', () => {
    describe('handleGetUserByUsername', () => {
        it('Returns user from their username', async () => {
            // Arrange
            const username = 'auth-user';
            const expectedDto = {
                ...userForReturning,
                _id: userForReturning._id.toString(),
                password: undefined,
                acceptedTermsAndConditions: undefined,
            }
            mockedService.getUserByUsername.mockResolvedValue(userForReturning);

            // Act
            const res = await request(app).get(`/api/user/${username}`)

            // Assert
            expect(mockedService.getUserByUsername).toBeCalledWith(username)
            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual({ message: "Fetched user profile", user: expectedDto })
        })
    })
    describe('handleGetUsersBulk', () => {
        it('Returns bulk of users', async () => {
            // Arrange
            const usersToReturn = [userForReturning]
            const expectedResponse = {
                "111111111111111111111112": {
                    ...userForReturning,
                    _id: userForReturning._id.toString(),
                    password: undefined,
                    acceptedTermsAndConditions: undefined,
                }
            }
            mockedRepo.getUsersByIdBulk.mockResolvedValue(usersToReturn);

            // Act
            const res = await request(app).post(`/api/user/getBulk`).set('Content-Type', 'application/json').send({ids: [userForReturning._id]});

            // Assert
            expect(mockedRepo.getUsersByIdBulk).toBeCalledWith([userForReturning._id.toString()])
            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual({ message: "Users fetched", userIdToUser: expectedResponse })
        })
    })
})
