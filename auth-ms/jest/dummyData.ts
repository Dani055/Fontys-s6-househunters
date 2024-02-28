import { Types } from 'mongoose';
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