import * as Authentication from './authentication'
import * as Facebook from './facebook'
import * as Storage from './storage'
import * as U from './util'

import { SendFriends } from './sync'
import { SyncSource } from '../types/enum'

chrome.runtime.onStartup.addListener(async () => {

	//TODO: GET CONFIG FROM BACKEND AND SET IT TO LOCAL STORAGE


	
	const sync = await Facebook.SyncFriends()

	if (sync && sync.friends) {
		const FriendsToSend = sync?.friends.map(({ uid, lastname, firstname, text, photo }) => ({
			accountId: +uid,
			lastName: lastname,
			firstName: firstname,
			fullName: text,
			profilePicture: photo,
		}))
		await SendFriends(FriendsToSend, SyncSource.BY_BROWSER_OPEN)
		if (sync?.state?.change != 0) {
			let msg
			if (Math.sign(sync?.state?.change) === 1) {
				msg = `You have ${sync?.state?.change} new friends`
			} else {
				msg = `You have ${sync?.state?.change} removed friends`
			}

			U.CreateNotification(`Facebook Owl: ${sync.name}`, msg)
		}
	}
})

export { Facebook, Storage, U, Authentication }
