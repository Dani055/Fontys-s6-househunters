import { Schema, model } from 'mongoose';
import { IBase } from './modelBase';
import * as bcrypt from 'bcrypt';

export interface IUser extends IBase {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  roles: string[];
}

const userSchema = new Schema<IUser>({
  email: {
    type: Schema.Types.String,
    required: true,
    unique: true
  },
  username: {
    type: Schema.Types.String,
    required: true,
  },
  password: {
    type: Schema.Types.String,
    required: true,
  },
  firstName: {
    type: Schema.Types.String,
    required: true,
  },
  lastName: {
    type: Schema.Types.String,
    required: true,
  },
  address: {
    type: Schema.Types.String,
    required: true,
  },
  phone: {
    type: Schema.Types.String,
    required: true,
  },
  roles: [{ type: Schema.Types.String, required: true }]
}, { versionKey: false, timestamps: true });
const UserEntity = model<IUser>('User', userSchema);

export async function seedAdminUser() {
  try {
    let users = await UserEntity.find();
    if (users.length > 0) return;
    const userToCreate = {
      _id: '652941c3938e8759af40aa91',
      email: 'admin@admin',
      password: '123',
      username: 'adminer',
      firstName: 'Admin4o',
      lastName: 'Adminov',
      address: '123 avenue',
      phone: '+312345678',
      roles: ['Admin', 'User']
    }
    userToCreate.password = await bcrypt.hash(userToCreate.password, 10)
    UserEntity.create(userToCreate);
    console.log('Seeded database')
  } catch (e) {
    console.log(e);
  }
};

export default UserEntity;