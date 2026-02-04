import mongoose, { Document, Schema, Types } from 'mongoose';
import { compareValue, hashValue } from '../utils/bcrypt';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email?: string;
  password?: string;
  avatar?: string | null;
  isAI?: boolean;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(value: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: function (this: IUser) {
        return !this.isAI;
      }, //only make it required when it's not an ai user
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function (this: IUser) {
        return !this.isAI;
      }, //only make it required when it's not an ai user,
    },
    avatar: { type: String, default: null },
    isAI: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        if (ret) {
          delete (ret as any).password;
        }
        return ret;
      },
    },
  },
);

userSchema.methods.comparePassword = async function (val: string) {
  return compareValue(val, this.password);
};

const UserModel = mongoose.model<IUser>('User', userSchema);
export default UserModel;
