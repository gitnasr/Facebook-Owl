import {AUTH} from '@/types';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema<AUTH.IUserDoc, AUTH.IUserModel>(
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

const User = mongoose.model<AUTH.IUserDoc, AUTH.IUserModel>('User', UserSchema);

export default User;
