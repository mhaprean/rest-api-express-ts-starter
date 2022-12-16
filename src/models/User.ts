import mongoose, { Document, Model } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  image?: string;
  imageThumb?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserModel extends IUser, Document {}

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    imageThumb: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUserModel>('User', UserSchema);
