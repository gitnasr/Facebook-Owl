export interface Cookie {
	domain: string
	expirationDate: number
	hostOnly: boolean
	httpOnly: boolean
	name: string
	path: string
	sameSite: string
	secure: boolean
	session: boolean
	storeId: string
	value: string | number
}

export interface IFriend {
	firstname: string
	lastname: string
	uid: string
	text: string
	photo: string
}

export interface IFriendSync {
	accountId: number
	lastName: string
	firstName: string
	fullName: string
	profilePicture: string
}

