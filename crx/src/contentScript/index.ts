import * as Authentication from './authentication'
import * as Facebook from './facebook'
import * as Storage from './storage'
import * as U from './util'

import { SendFriends } from './sync'
import { SyncSource } from '../types/enum'

chrome.runtime.onStartup.addListener(async () => {
	const sync = await Facebook.SyncFriends()

	if (sync?.friends) {
		const FriendsToSend = sync?.friends.map(({ uid, lastname, firstname, text, photo }) => ({
			accountId: +uid,
			lastName: lastname,
			firstName: firstname,
			fullName: text,
			profilePicture: photo,
		}))
		await SendFriends(FriendsToSend, SyncSource.BY_BROWSER_OPEN)
		if (sync?.state?.change > 0) {
			chrome.notifications.create('onStartup', {
				message: `Your friends list has ${sync?.state?.change}`,
				title: 'Friends list changed',
				type: 'basic',
				iconUrl: '/img/logo-128.png',
			})
		}
	}
})

export { Facebook, Storage, U, Authentication }
