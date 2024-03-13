import { IProfile, State } from './storage.interfaces'

import { IFriend } from './facebook.interfaces'

export interface IAccountInfo {
	accountName: string
	friendsURL: string
}
export interface ISync extends IProfile {
	friends: IFriend[]
	state: State
}

export interface ToBeSent {
	accountId: number
	lastName: string
	firstName: string
	fullName: string
	profilePicture: string
}
