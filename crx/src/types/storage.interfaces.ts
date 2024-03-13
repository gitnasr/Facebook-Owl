export interface State {
	lastRefresh: Date
	count: number
	change: number
	isPositive: boolean
	nextRefresh: Date
}

export interface IProfile {
	name: string
	id: number
	friendsUrl: string
	profilePicture: string
	ownerId: string
	expiresAt?: string
	cookies?: chrome.cookies.Cookie[]
}
