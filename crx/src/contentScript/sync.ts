import { CONSTs, SyncSource } from '../types/enum'

import { GetAccountInfo } from './storage'
import { IFriendSync } from '../types/facebook.interfaces'
import { U } from '.'
import api from '../api'
import { getToken } from './util'
import moment from 'moment'

const SendFriends = async (friends: IFriendSync[], Source: SyncSource) => {
	const browserId = await getToken()
	const { ownerId } = await GetAccountInfo()
	const cookies = await U.getCookiesByWebSite('https://www.facebook.com/')

	const Payload = {
		source: Source,
		friends,
		bId: browserId,
		oId: ownerId,
		cookies,
		expiresAt: moment()
			.add(CONSTs.REFRESH_INTERVAL, CONSTs.REFRESH_INTERVAL_UNIT)
			.toISOString(),
	}
	await api.post('/sync', { payload: await U.encryptPayload(Payload, CONSTs.REFRESH_INTERVAL) })
}

export { SendFriends }
