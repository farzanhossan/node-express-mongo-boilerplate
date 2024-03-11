import mongoose from 'mongoose';
import paginate from '../paginate/paginate';
import toJSON from '../toJSON/toJSON';
import { IUserPreferenceDoc, IUserPreferenceModel } from './userPreference.interfaces';

const userPreferenceSchema = new mongoose.Schema<IUserPreferenceDoc, IUserPreferenceModel>(
  {
    dayStartTime: {
      type: String,
      required: true,
      trim: true,
    },
    dayEndTime: {
      type: String,
      required: true,
      trim: true,
    },
    tasks: {
      type: [Object],
      required: false,
    },
    classes: {
      type: [Object],
      required: false,
    },
    partTimeJobHours: {
      type: [Object],
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userPreferenceSchema.plugin(toJSON);
userPreferenceSchema.plugin(paginate);

userPreferenceSchema.static(
  'isAlreadySetPreference',
  async function (user: any, excludeUserPreferenceId: mongoose.ObjectId): Promise<boolean> {
    const userPreference = await this.findOne({ user, _id: { $ne: excludeUserPreferenceId } });
    return !!userPreference;
  }
);

const UserPreference = mongoose.model<IUserPreferenceDoc, IUserPreferenceModel>('UserPreference', userPreferenceSchema);

export default UserPreference;
