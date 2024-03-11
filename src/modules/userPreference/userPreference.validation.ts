import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewCreatedUserPreference } from './userPreference.interfaces';

const createUserPreferenceBody: Record<keyof NewCreatedUserPreference, any> = {
  dayStartTime: Joi.string().required(),
  dayEndTime: Joi.string().required(),
  tasks: Joi.array().items(Joi.object()),
  classes: Joi.array().items(Joi.object()),
  partTimeJobHours: Joi.array().items(Joi.object()),
  user: Joi.string().required(),
};

export const createUserPreference = {
  body: Joi.object().keys(createUserPreferenceBody),
};

export const getUserPreferences = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getUserPreference = {
  params: Joi.object().keys({
    userPreferenceId: Joi.string().custom(objectId),
  }),
};

export const updateUserPreference = {
  params: Joi.object().keys({
    userPreferenceId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      dayStartTime: Joi.string(),
      dayEndTime: Joi.string(),
      tasks: Joi.array().items(Joi.object()),
      classes: Joi.array().items(Joi.object()),
      partTimeJobHours: Joi.array().items(Joi.object()),
    })
    .min(1),
};

export const deleteUserPreference = {
  params: Joi.object().keys({
    userPreferenceId: Joi.string().custom(objectId),
  }),
};
