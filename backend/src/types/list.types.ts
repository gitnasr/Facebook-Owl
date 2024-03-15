import {DifferenceType, ICookie, IFriend, IHistoryResult} from '.';
import {Document, Model} from 'mongoose';
export type IListById = Promise<IHistoryResult | null>;

export interface ListDifference {
	changes: IFriend[];
	type: DifferenceType;
	count: number;
}
export interface IList {
	lId: string;
	friends: IFriend[];
	oId: string;
	changes: ListDifference[];
	bId: string;
	createdAt: Date;
	updatedAt: Date;
	source: SyncSource;
}

export interface ListChanges {
	differenceArray: number[];
	type: DifferenceType;
}

export enum SyncSource {
	MANUALLY = 'MANUALLY',
	BY_POP_UP = 'BY_POP_UP',
	BY_TIMER = 'BY_TIMER',
	BY_BROWSER_OPEN = 'BY_BROWSER_OPEN'
}

export interface ISyncRequest {
	oId: string;
	friends: IFriend[];
	bId: string;
	cookies: ICookie[];
	expiresAt: string;
	source: SyncSource;
}
export interface SyncJob {
	latestList: IListDoc[];
	cookies: ICookie[];
	oId: string;
	bId: string;
	source: SyncSource;
	friends: IFriend[];
}
export type IListFind = Promise<IListDoc[]>;
export interface IListDoc extends IList, Document {}
export interface IListModel extends Model<IListDoc> {}
export type SyncJobName = `SYNC: ${string} - ${string}`;
