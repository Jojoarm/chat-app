import cloudinary from '../config/cloudinary.config';
import UserModel from '../models/user.model';
import { NotFoundException, UnauthorizedException } from '../utils/app-error';
import { hashValue } from '../utils/bcrypt';
import {
  LoginSchemaType,
  SignUpSchemaType,
} from '../validators/user.validator';

export const signUpUserService = async (body: SignUpSchemaType) => {
  const { name, email, password, avatar } = body;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) throw new UnauthorizedException('User already exist');

  const hashedPassword = await hashValue(password);

  let avatarUrl;

  if (avatar) {
    // upload to cloudinary
    const uploadRes = await cloudinary.uploader.upload(avatar);
    avatarUrl = uploadRes.secure_url;
  }

  const newUser = new UserModel({
    name,
    email,
    password: hashedPassword,
    avatar: avatarUrl,
  });

  await newUser.save();
  return newUser;
};

export const loginUserService = async (body: LoginSchemaType) => {
  const { email, password } = body;

  const user = await UserModel.findOne({ email });
  if (!user) throw new NotFoundException('Email or Password not found');

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid)
    throw new UnauthorizedException('Invaild email or password');

  return user;
};

export const findByIdUserService = async (userId: string) => {
  return await UserModel.findById(userId);
};

export const getUsersService = async (userId: string) => {
  const users = await UserModel.find({ _id: { $ne: userId } }); //won't include the current user

  return users;
};
