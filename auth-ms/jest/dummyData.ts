import { IUser } from 'auth-ms/src/models/User';
import { Types } from 'mongoose';
export const userForJwt = {
    _id: "111111111111111111111111",
    roles: ['User'],
}
export const userForReturning: IUser = {
    _id: new Types.ObjectId('111111111111111111111112'),
    email: "auth-user@email",
    password: "$2b$10$rVR1hQJ8Uz38K76FTAx6SuYX5OfFsD4Dejggz5ki5GoreSZ0j9S9m",
    username: 'auth-user',
    firstName: 'fname',
    lastName: 'lname',
    address: '123 avenue',
    phone: '+31',
    roles: ['User']
}
export const userForAuthTests = {
    _id: new Types.ObjectId("111111111111111111111111"),
    email: 'first@email.com',
    password: '123',
    username: 'first',
    firstName: 'First',
    lastName: 'User',
    address: '123 avenue',
    phone: '+312345678',
    roles: ['User'],
}
