import { IFriend, IFriendSync } from './facebook.interfaces'
import { IProfile, State } from './storage.interfaces'

export interface IAccountInfo {
	accountName: string
	friendsURL: string
}
export interface ISync extends IProfile {
	friends: IFriendSync[]
	state: State
}

export interface ToBeSent {
	accountId: number
	lastName: string
	firstName: string
	fullName: string
	profilePicture: string
}
