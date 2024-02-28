import * as authRepo from 'auth-ms/src/repository/auth.repository';
import { loginUser } from 'auth-ms/src/services/auth.service';

import app from "auth-ms/index";
import { ResponseError } from 'shared/responses/responseError';

jest.mock('auth-ms/src/repository/auth.repository', () => {
    const original = jest.requireActual('auth-ms/src/repository/auth.repository')
    return {
        ...original,
        _esModule: true,
        findUserByEmail: jest.fn(),
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
    })
})
