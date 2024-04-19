import * as authRepo from 'auth-ms/src/repository/auth.repository';
import { loginUser, registerUser } from 'auth-ms/src/services/auth.service';

import app from "auth-ms/index";
import { ResponseError } from 'shared/responses/responseError';
import { userForReturning } from 'auth-ms/jest/dummyData';
import { registerUserPayload } from 'shared/requests/req';

jest.mock('auth-ms/src/repository/auth.repository', () => {
    const original = jest.requireActual('auth-ms/src/repository/auth.repository')
    return {
        ...original,
        _esModule: true,
        findUserByEmail: jest.fn(),
        createUser: jest.fn(),
    }
})
const mockedRepository = authRepo as jest.Mocked<typeof authRepo>;

beforeAll((done) => {
    app.on("appStarted", () =>  done())
});

describe('Auth service', () => {
    describe('loginUser', () => {
        it('Throws error if user is not found', async () => {
            // Arrange
            mockedRepository.findUserByEmail.mockResolvedValue(null);
            // Act
            const callFunc = async () => {
                await loginUser("asd", "123")
            }

            // Assert
            await expect(callFunc).rejects.toThrow(ResponseError)
            await expect(callFunc).rejects.toThrow("Wrong email or password!")
        })
        it('Throws error when password is incorrect', async () => {
            // Arrange
            mockedRepository.findUserByEmail.mockResolvedValue(userForReturning);
            // Act
            const callFunc = async () => {
                await loginUser("asd", "password")
            }

            // Assert
            await expect(callFunc).rejects.toThrow(ResponseError)
            await expect(callFunc).rejects.toThrow("Wrong email or password!")
        })
        it('Returns token for logged user', async () => {
            // Arrange
            mockedRepository.findUserByEmail.mockResolvedValue(userForReturning);

            // Act
            const token = await loginUser("asd", "123")

            // Assert
            expect(mockedRepository.findUserByEmail).toBeCalledWith('asd')
            expect(token).toBeTruthy();
        })
    })
    describe('registerUser', () => {
        it('Returns user with hashed password', async () => {
            // Arrange
            const payload: registerUserPayload = {
                email: "second@email",
                password: "secondpswd",
                username: 'second',
                firstName: 'fname',
                lastName: 'lname',
                address: '123 avenue',
                phone: '+31',
                acceptedTermsAndConditions: true,
            }
            mockedRepository.createUser.mockResolvedValue(userForReturning);

            // Act
            const user = await registerUser(payload)
            // Assert
            expect(user.password).toEqual('$2b$10$rVR1hQJ8Uz38K76FTAx6SuYX5OfFsD4Dejggz5ki5GoreSZ0j9S9m');
        })
    })
})
