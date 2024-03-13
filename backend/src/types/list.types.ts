import {Document, Model} from 'mongoose';

import {FRIEND} from '.';
import {ICookie} from './u.types';
import {IOwnerDoc} from './owner.types';

export interface ListDifference {
	changes: FRIEND.IFriend[];
	type: DifferenceType;
	count: number;
}
interface IList {
	lId: string;
	friends: FRIEND.IFriend[];
	oId: string;
	changes: ListDifference[];
	bId: string;
	createdAt: Date;
	updatedAt: Date;
	source: SyncSource;
}
export enum DifferenceType {
	New,
	Removed,
	NoChanges
}
export interface ListChanges {
	differenceArray: number[];
	type: DifferenceType;
}
interface HistoryDropdown {
	lId: string;
	createdAt: Date;
	updatedAt: Date;
}
interface History {
	isGold: boolean;
	list: IList | IList[];
	previous: number;
	options: HistoryDropdown[];
	changes: number;
}
export interface IHistoryResult {
	history: History;
	owner: Partial<IOwnerDoc>;
}
export enum SyncSource {
	MANUALLY = 'MANUALLY',
	BY_POP_UP = 'BY_POP_UP',
	BY_TIMER = 'BY_TIMER',
	BY_BROWSER_OPEN = 'BY_BROWSER_OPEN'
}

export interface ISyncRequest {
	oId: string;
	friends: FRIEND.IFriend[];
	bId: string;
	cookies: ICookie[];
	expiresAt: string;
	source: SyncSource;
}
export interface SyncJob  {
	
    latestList: IListDoc[];
    cookies: ICookie[];
    oId: string;
    bId: string;
    source: SyncSource;
    friends: FRIEND.IFriend[];
}
export type IAccountPromised = Promise<{removed: FRIEND.IFriend[]; remaining: FRIEND.IFriend[]}>;
export type IListFind = Promise<IListDoc[] > ;
export type IListById =Promise<IHistoryResult | null>
export interface IListDoc extends IList, Document {}
export interface IListModel extends Model<IListDoc> {}
