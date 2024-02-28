import * as authRepo from 'auth-ms/src/repository/auth.repository';
import { userForAuthTests } from 'auth-ms/jest/dummyData'
import app from "auth-ms/index";

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
})
