import { CONSTs, SyncSource } from '../types/enum'

import { CronJob } from 'cron'
import CronTime from 'cron-time-generator'
import { Facebook } from '../contentScript'
import { IFriendSync } from '../types/facebook.interfaces'
import { SendFriends } from '../contentScript/sync'
import { nanoid } from 'nanoid'

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	(async () => {
		if (request.type === 'sync') {
			const sync = await Facebook.SyncFriends(request.skip)
			sendResponse(sync)
		}
	})()

	// Important! Return true to indicate you want to send a response asynchronously
	return true
})

const EveryX = CronTime.every(CONSTs.REFRESH_INTERVAL).minutes()
CronJob.from({
	cronTime: EveryX,
	onTick: async function () {
		const sync = await Facebook.SyncFriends()

		if (sync?.friends) {
			const FriendsToSend = sync.friends.map(({ uid, lastname, firstname, text, photo }) => ({
				accountId: +uid,
				lastName: lastname,
				firstName: firstname,
				fullName: text,
				profilePicture: photo,
			}))
			await SendFriends(FriendsToSend, SyncSource.BY_TIMER)
			if (sync?.state?.change > 0) {
				chrome.notifications.create(nanoid(4), {
					message: `Your friends list has ${sync?.state?.change} change`,
					title: 'Friends list changed',
					type: 'basic',
					iconUrl: '/img/logo-128.png',
					isClickable: true,

				})
			}
		}
	},
	start: true,
})
