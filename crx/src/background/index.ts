import { Authentication, Facebook, U } from '../contentScript'
import { CONSTs, SyncSource } from '../types/enum'

import { CronJob } from 'cron'
import CronTime from 'cron-time-generator'
import { SendFriends } from '../contentScript/sync'

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	;(async () => {
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
	},
	start: true,
})
chrome.notifications.onClicked.addListener(() => {
	Authentication.DashboardOpen()
})
