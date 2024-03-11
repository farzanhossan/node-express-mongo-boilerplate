import mongoose, { Document, Model } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface IUserPreference {
  dayStartTime: string;
  dayEndTime: string;
  tasks?: object[];
  classes?: object[];
  partTimeJobHours?: object[];
  user: mongoose.Types.ObjectId;
}

export type NewCreatedUserPreference = IUserPreference;

export interface IUserPreferenceDoc extends IUserPreference, Document {}

export interface IUserPreferenceModel extends Model<IUserPreferenceDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateUserPreferenceBody = Partial<IUserPreference>;
