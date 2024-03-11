import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as userPreferenceService from './userPreference.service';

export const createUserPreference = catchAsync(async (req: Request, res: Response) => {
  const userPreference = await userPreferenceService.createUserPreference(req.body);
  res.status(httpStatus.CREATED).send(userPreference);
});

export const getUserPreferences = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['user']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await userPreferenceService.queryUserPreferences(filter, options);
  res.send(result);
});

export const getUserPreference = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userPreferenceId'] === 'string') {
    const userPreference = await userPreferenceService.getUserPreferenceById(
      new mongoose.Types.ObjectId(req.params['userPreferenceId'])
    );
    if (!userPreference) {
      throw new ApiError(httpStatus.NOT_FOUND, 'UserPreference not found');
    }
    res.send(userPreference);
  }
});

export const updateUserPreference = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userPreferenceId'] === 'string') {
    const userPreference = await userPreferenceService.updateUserPreferenceById(
      new mongoose.Types.ObjectId(req.params['userPreferenceId']),
      req.body
    );
    res.send(userPreference);
  }
});

export const deleteUserPreference = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userPreferenceId'] === 'string') {
    await userPreferenceService.deleteUserPreferenceById(new mongoose.Types.ObjectId(req.params['userPreferenceId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});

export const getScheduleFromUserPreference = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userPreferenceId'] === 'string') {
    const plannedSchedule = await userPreferenceService.getScheduleFromUserPreference(
      new mongoose.Types.ObjectId(req.params['userPreferenceId'])
    );

    res.send(plannedSchedule);
  }
});
