import {IList, IOwnerDoc} from "."

import { JwtPayload } from 'jsonwebtoken';

interface History {
	list: IList | undefined;
	previous: number;
	options: HistoryDropdown[];
	changes: number;
}
export interface IHistory extends JwtPayload {
	ownerId: string;
	browserId: string;
	iat: number;
	exp: number;
}


export interface HistoryDropdown {
	lId: string;
	createdAt: Date;
	updatedAt: Date;
	changes: number;
}

export interface IHistoryResult {
	history: History;
	owner: Partial<IOwnerDoc>;
}

export interface IHistoryResponse {
	status: 'success' | 'error';
	history: History;
	owner: Partial<IOwnerDoc>;
	isProcessing: boolean;
}


