import * as authRepo from 'auth-ms/src/repository/auth.repository';
import { userForAuthTests } from 'auth-ms/jest/dummyData'
import app from "auth-ms/index";
import { ResponseError } from 'shared/responses/responseError';
import { registerUserPayload } from 'shared/requests/req';

beforeAll((done) => {
    app.on("appStarted", () => done())
});

describe('Auth repository', () => {
    describe('findUserByEmail', () => {
        it('Returns null if user is not found', async () => {
            // Arrange
            // Act
            const user = await authRepo.findUserByEmail('notExistig');

            // Assert
            expect(user).toEqual(null);
        })
        it('Returns found user by email', async () => {
            // Arrange
            const expectedUser = userForAuthTests
            // Act
            const user = await authRepo.findUserByEmail('first@email.com');
            // Assert
            expect(user).toMatchObject(expectedUser);
        })
    })
    describe('findUserByUsername', () => {
        it('Throws error if user is not found', async () => {
            // Arrange
            // Act
            const callFunc = async () => {
                await authRepo.findUserByUsername('notExistig');
            }

            // Assert
            await expect(callFunc).rejects.toThrow(ResponseError)
            await expect(callFunc).rejects.toThrow("User with specified username was not found")
        })
        it('Returns found user by username', async () => {
            // Arrange
            const expectedUser = userForAuthTests
            // Act
            const user = await authRepo.findUserByUsername('first');
            // Assert
            expect(user).toMatchObject(expectedUser);
        })
    })
    describe('findUserById', () => {
        it('Throws error if user is not found', async () => {
            // Arrange
            // Act
            const callFunc = async () => {
                await authRepo.findUserById('111111111119991111111112');
            }

            // Assert
            await expect(callFunc).rejects.toThrow(ResponseError)
            await expect(callFunc).rejects.toThrow("User with specified id was not found")
        })
        it('Returns found user by username', async () => {
            // Arrange
            const expectedUser = userForAuthTests
            // Act
            const user = await authRepo.findUserById(userForAuthTests._id.toString());
            // Assert
            expect(user).toMatchObject(expectedUser);
        })
    })
    describe('createUser', () => {
        it('Returns created user', async () => {
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
            const expectedUser = {
                ...payload,
                roles: ["User"]
            }
            // Act
            const user = await authRepo.createUser(payload);
            // Assert
            expect(user).toMatchObject(expectedUser);
        })
    })
})
