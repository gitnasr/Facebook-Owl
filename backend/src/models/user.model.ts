import { IUserDoc, IUserModel } from '@/types';

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema<IUserDoc, IUserModel>(
	{
		browserId: {
			type: String,
			required: true,
			unique: true,
			trim: true
		},
		browserVersion: Number,
		browserType: String,
		country: String
	},
	{
		timestamps: true,
		versionKey: false
	}
);

const User = mongoose.model<IUserDoc, IUserModel>('User', UserSchema);

export default User;
