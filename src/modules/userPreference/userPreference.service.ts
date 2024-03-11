import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { IUserPreferenceDoc, NewCreatedUserPreference, UpdateUserPreferenceBody } from './userPreference.interfaces';
import UserPreference from './userPreference.model';
import generateStudyPlan from '../utils/suggestedSchedule';

/**
 * Create a userPreference
 * @param {NewCreatedUserPreference} userPreferenceBody
 * @returns {Promise<IUserPreferenceDoc>}
 */
export const createUserPreference = async (userPreferenceBody: NewCreatedUserPreference): Promise<IUserPreferenceDoc> => {
  // if (await UserPreference.isAlreadySetPreference(userPreferenceBody.user)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'This User already set preference.');
  // }
  return UserPreference.create(userPreferenceBody);
};

/**
 * Query for userPreferences
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryUserPreferences = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const userPreferences = await UserPreference.paginate(filter, options);
  return userPreferences;
};

/**
 * Get userPreference by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IUserPreferenceDoc | null>}
 */
export const getUserPreferenceById = async (id: mongoose.Types.ObjectId): Promise<IUserPreferenceDoc | null> =>
  UserPreference.findById(id);

/**
 * Update userPreference by id
 * @param {mongoose.Types.ObjectId} userPreferenceId
 * @param {UpdateUserPreferenceBody} updateBody
 * @returns {Promise<IUserPreferenceDoc | null>}
 */
export const updateUserPreferenceById = async (
  userPreferenceId: mongoose.Types.ObjectId,
  updateBody: UpdateUserPreferenceBody
): Promise<IUserPreferenceDoc | null> => {
  const userPreference = await getUserPreferenceById(userPreferenceId);
  if (!userPreference) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UserPreference not found');
  }

  Object.assign(userPreference, updateBody);
  await userPreference.save();
  return userPreference;
};

/**
 * Delete userPreference by id
 * @param {mongoose.Types.ObjectId} userPreferenceId
 * @returns {Promise<IUserPreferenceDoc | null>}
 */
export const deleteUserPreferenceById = async (
  userPreferenceId: mongoose.Types.ObjectId
): Promise<IUserPreferenceDoc | null> => {
  const userPreference = await getUserPreferenceById(userPreferenceId);
  if (!userPreference) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UserPreference not found');
  }
  await userPreference.deleteOne();
  return userPreference;
};

export const getScheduleFromUserPreference = async (id: mongoose.Types.ObjectId) => {
  const userPreference = await UserPreference.findById(id).lean();
  if (!userPreference) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UserPreference not found');
  }
  return generateStudyPlan(
    userPreference?.dayStartTime,
    userPreference?.dayEndTime,
    userPreference?.tasks || [],
    userPreference?.classes || [],
    userPreference?.partTimeJobHours || []
  );
};
