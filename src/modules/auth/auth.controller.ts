import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { tokenService } from '../token';
import { userService } from '../user';
import * as authService from './auth.service';
import { emailService } from '../email';
import { resSend } from '../response/response';

export const register = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.registerUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  resSend({ user, tokens }, httpStatus.CREATED, res);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  resSend({ user, tokens }, httpStatus.OK, res);
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  await authService.logout(req.body.refreshToken);
  resSend(null, httpStatus.NO_CONTENT, res, 'Logged out successfully');
});

export const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const userWithTokens = await authService.refreshAuth(req.body.refreshToken);
  resSend(userWithTokens, httpStatus.OK, res);
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  resSend(null, httpStatus.NO_CONTENT, res, 'Password reset link sent successfully');
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  await authService.resetPassword(req.query['token'], req.body.password);
  resSend(null, httpStatus.NO_CONTENT, res, 'Password reset successfully');
});

export const sendVerificationEmail = catchAsync(async (req: Request, res: Response) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken, req.user.name);
  resSend(null, httpStatus.NO_CONTENT, res, 'Verification email sent successfully');
});

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  await authService.verifyEmail(req.query['token']);
  resSend(null, httpStatus.NO_CONTENT, res, 'Email verified successfully');
});
