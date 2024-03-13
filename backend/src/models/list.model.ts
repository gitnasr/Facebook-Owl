import {Schema, model} from 'mongoose';

import {LIST} from '@/types';

const FriendList = new Schema<LIST.IListDoc, LIST.IListModel>(
	{
		lId: String,
		friends: Array,
		oId: String,
		changes: Array,
		bId: String,
		source: {
			type: String,
			enum: LIST.SyncSource
		}
	},
	{
		timestamps: true,
		versionKey: false
	}
);

const List = model<LIST.IListDoc, LIST.IListModel>('List', FriendList);

export default List;
