export enum BlacklistTokenKey {
	LoginToken = 'BLACKLIST_LOGIN_TOKEN',
	SyncToken = 'BLACKLIST_SYNC_TOKEN'
}
export enum DifferenceType {
	New,
	Removed,
	NoChanges
}

export enum SyncSource {
	MANUALLY = 'MANUALLY',
	BY_POP_UP = 'BY_POP_UP',
	BY_TIMER = 'BY_TIMER',
	BY_BROWSER_OPEN = 'BY_BROWSER_OPEN',
	ON_INSTALL = "ON_INSTALL"
}
