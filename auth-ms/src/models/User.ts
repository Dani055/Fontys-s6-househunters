import { Schema, model } from 'mongoose';
import { IBase } from './modelBase';
import * as bcrypt from 'bcrypt';
import { seedUsers } from '../database/seed';

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
    unique: true,
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
    seedUsers.forEach(async (u) => {
      u.password = await bcrypt.hash(u.password, 10)
      await UserEntity.create(u);
    });
    console.log('Seeded database')
  } catch (e) {
    console.log(e);
  }
};

export default UserEntity;