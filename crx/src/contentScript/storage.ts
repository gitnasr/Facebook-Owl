import { IProfile, State } from '../types/storage.interfaces'

import { CONSTs } from '../types/enum'
import moment from 'moment'

export const UpdateState = async (state: State): Promise<Boolean> => {
	try {
		await chrome.storage.sync.set({ ['state']: JSON.stringify(state) })
		return true
	} catch (error) {
		return false
	}
}

export const GetState = async (): Promise<State> => {
	const { state } = await chrome.storage.sync.get(['state'])

	if (!state) {
		const State: State = {
			change: 0,
			count: 0,
			isPositive: false,
			lastRefresh: moment().toDate(),
			nextRefresh: moment()
				.add(CONSTs.REFRESH_INTERVAL, CONSTs.REFRESH_INTERVAL_UNIT)
				.toDate(),
		}
		return State
	}
	return JSON.parse(state)
}

export const UpdateAccountInfo = async (info: IProfile): Promise<Boolean> => {
	try {
		await chrome.storage.sync.set({ ['info']: info })
		return true
	} catch (error) {
		console.log('🚀 ~ UpdateAccountInfo ~ error:', error)
		return false
	}
}

export const GetAccountInfo = async (): Promise<IProfile> => {
	const { info } = await chrome.storage.sync.get(['info'])
	return info
}

export const ClearState = () => {
	return chrome.storage.sync.clear()
}
