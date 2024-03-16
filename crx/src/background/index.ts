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

	return true
})

const EveryX = CronTime.every(CONSTs.REFRESH_INTERVAL).minutes()
CronJob.from({
	cronTime: EveryX,

	onTick: async function () {
		const sync = await Facebook.SyncFriends()

		if (sync?.friends) {
			await SendFriends(sync?.friends, SyncSource.BY_TIMER)
			if (sync?.state?.change !== 0) {
				const change = sync.state.change
				const messageType = change > 0 ? 'new' : 'removed'
				const friendCount = Math.abs(change)
				const message = `You have ${friendCount} ${messageType} friend${friendCount !== 1 ? 's' : ''}`
				const notificationTitle = `Facebook Owl: ${sync.name}`

				U.CreateNotification(notificationTitle, message)
			}
		}
	},
	start: true,
})
chrome.notifications.onClicked.addListener(() => {
	Authentication.DashboardOpen()
})
chrome.runtime.onInstalled.addListener(async (info) => {
	const sync = await Facebook.SyncFriends()

	if (sync?.friends) {
		await SendFriends(sync?.friends, SyncSource.ON_INSTALL)

		U.CreateNotification(
			`Facebook Owl: ${sync.name}`,
			'Your First Friend List is Synced, we are working on it.',
		)
	}
})
