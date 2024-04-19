export const mockJwt = (mockedJwt: any, user: any) => {
    mockedJwt.isAuth.mockImplementation(jest.fn((req, res, next) => {
        req.userId = user._id;
        req.userRoles = user.roles
        next();
    }));
}
