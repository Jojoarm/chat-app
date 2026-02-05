import { Request, Response } from 'express';
import { loginSchema, signUpSchema } from '../validators/user.validator';
import { clearJwtAuthCookie, setJwtAuthCookie } from '../utils/cookie';
import { HTTPSTATUS } from '../config/http.config';
import { catchAsync } from '../middlewares/catchAsync';
import {
  getUsersService,
  loginUserService,
  signUpUserService,
} from '../services/user.service';

export const signUpUserController = catchAsync(
  async (req: Request, res: Response) => {
    const body = signUpSchema.parse(req.body);

    const user = await signUpUserService(body);
    const userId = user._id.toString();

    return setJwtAuthCookie({ res, userId }).status(HTTPSTATUS.CREATED).json({
      success: true,
      message: 'User registered successfully',
      user,
    });
  },
);

export const logInUserController = catchAsync(
  async (req: Request, res: Response) => {
    const body = loginSchema.parse(req.body);

    const user = await loginUserService(body);
    const userId = user._id.toString();

    return setJwtAuthCookie({
      res,
      userId,
    })
      .status(HTTPSTATUS.OK)
      .json({
        success: true,
        message: 'User logged in successfully!',
        user,
      });
  },
);

export const logoutController = catchAsync(
  async (req: Request, res: Response) => {
    return clearJwtAuthCookie(res).status(HTTPSTATUS.OK).json({
      success: true,
      message: 'User logged out successfully!',
    });
  },
);

export const authStatusController = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    return res
      .status(HTTPSTATUS.OK)
      .json({ success: true, message: 'User Authenticated!', user });
  },
);

export const getUsersController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const users = await getUsersService(userId);

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: 'Users fetched successfully!',
      users,
    });
  },
);
