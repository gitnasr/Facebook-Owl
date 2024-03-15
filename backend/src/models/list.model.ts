import { IListDoc, IListModel, SyncSource } from '@/types';
import {Schema, model} from 'mongoose';

const FriendList = new Schema<IListDoc, IListModel>(
	{
		lId: String,
		friends: Array,
		oId: String,
		changes: Array,
		bId: String,
		source: {
			type: String,
			enum: SyncSource
		}
	},
	{
		timestamps: true,
		versionKey: false
	}
);

const List = model<IListDoc, IListModel>('List', FriendList);

export default List;
