import { Authentication, Facebook, Storage, U } from '../contentScript'
import { CONSTs, SyncSource } from '../types/enum'

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

chrome.notifications.onClicked.addListener(() => {
	Authentication.DashboardOpen()
})
chrome.runtime.onInstalled.addListener(async ({ reason }) => {
	if (reason !== 'install') return

	const sync = await Facebook.SyncFriends()
	if (!sync.friends) return
	if (sync.friends.length > 0) {
		await SendFriends(sync.friends, SyncSource.ON_INSTALL)
		U.CreateNotification(
			`Facebook Owl: ${sync.name}`,
			'Your First Friend List is Synced, we are working on it.',
		)
	} else {
		U.CreateNotification(
			`Facebook Owl: ${sync.name}`,
			'No Facebook Friends Found. Please make sure you are logged in.',
		)
	}

	chrome.alarms.create('sync', {
		periodInMinutes: +CONSTs.REFRESH_INTERVAL,
	})
})
chrome.alarms.onAlarm.addListener(async (alarm) => {
	if (alarm.name === 'sync') {
		const sync = await Facebook.SyncFriends()
		if (!sync.friends) return

		if (sync.friends.length > 0) {
			await SendFriends(sync.friends, SyncSource.BY_TIMER)
			if (sync.state.change !== 0) {
				const change = sync.state.change
				const messageType = change > 0 ? 'new' : 'removed'
				const friendCount = Math.abs(change)
				const message = `You have ${friendCount} ${messageType} friend${friendCount !== 1 ? 's' : ''}`
				const notificationTitle = `Facebook Owl: ${sync.name}`

				U.CreateNotification(notificationTitle, message)
			}
		}
	}
})
chrome.runtime.onStartup.addListener(async () => {
	const sync = await Facebook.SyncFriends()
	if (!sync.friends) return
	if (sync.friends.length > 0) {
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
