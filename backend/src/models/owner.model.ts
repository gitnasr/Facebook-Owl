import mongoose, {Types} from 'mongoose';

import {OWNER} from '@/types';

const OwnerSchema = new mongoose.Schema<OWNER.IOwnerDoc, OWNER.IOwnerModel>(
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
		pp_hash: String
	},
	{
		timestamps: true,
		versionKey: false
	}
);

const Owner = mongoose.model<OWNER.IOwnerDoc, OWNER.IOwnerModel>('Owner', OwnerSchema);

export default Owner;
