import * as Authentication from './authentication'
import * as Facebook from './facebook'
import * as Storage from './storage'
import * as U from './util'

import { SendFriends } from './sync'
import { SyncSource } from '../types/enum'

chrome.runtime.onStartup.addListener(async () => {
	const sync = await Facebook.SyncFriends()

	if (sync && sync.friends) {
		await SendFriends(sync.friends, SyncSource.BY_BROWSER_OPEN)
		if (sync?.state?.change !== 0) {
			const change = sync.state.change
			const messageType = change > 0 ? 'new' : 'removed'
			const friendCount = Math.abs(change)
			const message = `You have ${friendCount} ${messageType} friend${friendCount !== 1 ? 's' : ''}`
			const notificationTitle = `Facebook Owl: ${sync.name}`

			U.CreateNotification(notificationTitle, message)
		}
	}
})

export { Facebook, Storage, U, Authentication }
