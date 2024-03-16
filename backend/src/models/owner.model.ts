import { IOwnerDoc, IOwnerModel } from '@/types';
import mongoose, {Types} from 'mongoose';

const OwnerSchema = new mongoose.Schema<IOwnerDoc, IOwnerModel>(
	{
		accountName: String,
		accountId: Number,
		browserId: {
			type: String,
			required: true,
			trim: true
		},
		profilePic: String,
		oId: String,
		friendsCount: Number,
		friendList: [
			{
				type: Types.ObjectId,
				ref: 'List'
			}
		],
		cookies: [],
		pp_hash: String,
		country: String
	},
	{
		timestamps: true,
		versionKey: false
	}
);

const Owner = mongoose.model<IOwnerDoc, IOwnerModel>('Owner', OwnerSchema);

export default Owner;
