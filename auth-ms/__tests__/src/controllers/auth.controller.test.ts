import app from "auth-ms/index";
import { Types } from 'mongoose';
import request from "supertest";
import * as authService from 'auth-ms/src/services/auth.service';
import * as isAuth from 'auth-ms/src/middleware/is-auth';
import { IUser } from "auth-ms/src/models/User";
import { UserDTO } from "shared/dtos/userDTO";

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
    }
})
jest.mock('auth-ms/src/middleware/is-auth', () => {
    return {
        isAuth: jest.fn()
    }
});

const mockedService = authService as jest.Mocked<typeof authService>;
const mockedJwt = isAuth as jest.Mocked<typeof isAuth>;

const mockJwt = (userId: string) => {
    mockedJwt.isAuth.mockImplementation(jest.fn((req, res, next) => {
        req.userId = userId;
        next();
    }));
}

describe('Auth controller', () => {
    describe('handleLogin', () => {
        it('Returns 400 if missing email in request', async () => {
            // Arrange
            // Act
            const res = await request(app).post('/auth/login');

            // Assert
            expect(res.statusCode).toEqual(400)
            expect(res.body).toEqual({ message: "Invalid email" })
        })
        it('Returns 400 if missing password in request', async () => {
            // Arrange
            const email = "email"
            // Act
            const res = await request(app).post('/auth/login').set('Content-Type', 'application/json').send({ email });

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
            const res = await request(app).post('/auth/login').set('Content-Type', 'application/json').send({ email, password });

            // Assert
            expect(mockedService.loginUser).toBeCalledWith(email, password)
            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual({ message: "User successfully logged in!", token: tokenResponse })
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
                password: 'pass'
            }
            mockJwt(userId)
            mockedService.getUserById.mockResolvedValue(userToReturn);

            // Act
            const res = await request(app).get('/auth/checkkey');

            // Assert
            expect(mockedService.getUserById).toBeCalledWith(userId)
            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual({ message: "User fetched", user: expectedDto })
        })
    })
})
