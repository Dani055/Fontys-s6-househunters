import app from "auth-ms/index";
import { Types } from 'mongoose';
import request from "supertest";
import * as authService from 'auth-ms/src/services/auth.service';
import { IUser } from "auth-ms/src/models/User";
import { UserDTO } from "shared/dtos/userDTO";
import { mockJwt } from "auth-ms/jest/common";
import * as isAuth from 'shared/middleware/is-auth';
import { registerUserPayload } from 'shared/requests/req'
import { userForJwt } from "auth-ms/jest/dummyData";

// Wait for app to fully start. For some reason the tests do not wait for it otherwise
beforeAll((done) => {
    app.on("appStarted", () => done())
});

jest.mock('auth-ms/src/services/auth.service', () => {
    const original = jest.requireActual('auth-ms/src/services/auth.service')
    return {
        ...original,
        _esModule: true,
        loginUser: jest.fn(),
        getUserById: jest.fn(),
        registerUser: jest.fn(),
    }
})
jest.mock('shared/middleware/is-auth', () => {
    return {
        isAuth: jest.fn()
    }
});

const mockedService = authService as jest.Mocked<typeof authService>;
const mockedJwt = isAuth as jest.Mocked<typeof isAuth>;

describe('Auth controller', () => {
    describe('handleLogin', () => {
        it('Returns 400 if missing email in request', async () => {
            // Arrange
            // Act
            const res = await request(app).post('/api/auth/login');

            // Assert
            expect(res.statusCode).toEqual(400)
            expect(res.body).toEqual({ message: "Invalid email" })
        })
        it('Returns 400 if missing password in request', async () => {
            // Arrange
            const email = "email"
            // Act
            const res = await request(app).post('/api/auth/login').set('Content-Type', 'application/json').send({ email });

            // Assert
            expect(res.statusCode).toEqual(400)
            expect(res.body).toEqual({ message: "Missing password" })
        })
        it('Returns token on successful login', async () => {
            // Arrange
            const tokenResponse = 'auth token';
            const email = "jrdn@mail.com";
            const password = "123";
            mockedService.loginUser.mockResolvedValue(tokenResponse);

            // Act
            const res = await request(app).post('/api/auth/login').set('Content-Type', 'application/json').send({ email, password });

            // Assert
            expect(mockedService.loginUser).toBeCalledWith(email, password)
            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual({ message: "User successfully logged in!", token: tokenResponse })
        })
    })
    describe('handleRegister', () => {
        it('Returns registered user', async () => {
            // Arrange
            const payload: registerUserPayload = {
                email: "registered@email",
                password: "pswd",
                username: 'registered',
                firstName: 'fname',
                lastName: 'lname',
                address: '123 avenue',
                phone: '+31',
            }
            const userToReturn: IUser = {
                ...payload,
                _id: new Types.ObjectId('111111111111111111111112'),
                roles: ['User'],
                acceptedTermsAndConditions: true,
            }
            const expectedDto = {
                ...userToReturn,
                _id: '111111111111111111111112',
                password: undefined,
                acceptedTermsAndConditions: undefined
            }

            mockedService.registerUser.mockResolvedValue(userToReturn);

            // Act
            const res = await request(app).post('/api/auth/register').set('Content-Type', 'application/json').send(payload);

            // Assert
            expect(mockedService.registerUser).toBeCalledWith(payload)
            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual({ message: "User successfully registered", user: expectedDto })
        })
    })
    describe('handleGetuserByToken', () => {
        it('Returns user from token', async () => {
            // Arrange
            const userId = '111111111111111111111111'
            const expectedDto: UserDTO = {
                _id: userId,
                email: 'found@email.com',
                username: 'found',
                firstName: 'fname',
                lastName: 'lname',
                address: '123 avenue',
                phone: '359',
                roles: ['User']
            }
            const userToReturn: IUser = {
                ...expectedDto,
                _id: new Types.ObjectId(userId),
                acceptedTermsAndConditions: true,
                password: 'pass'
            }
            mockJwt(mockedJwt, userForJwt)
            mockedService.getUserById.mockResolvedValue(userToReturn);

            // Act
            const res = await request(app).get('/api/auth/checkkey');

            // Assert
            expect(mockedService.getUserById).toBeCalledWith(userId)
            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual({ message: "User fetched", user: expectedDto })
        })
    })
})
