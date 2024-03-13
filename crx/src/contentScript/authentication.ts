import { getBrowserInfo, getToken, setToken } from './util'

import { CONSTs } from '../types/enum'
import { GetAccountInfo } from './storage'
import { nanoid } from 'nanoid'
import { sign } from 'jsonwebtoken-esm'

const WebTokenGenerator = (info: {}) => {
	const token = sign(info, CONSTs.JSWOKEN as string, { expiresIn: '5m' })
	return token
}
const DashboardOpen = async () => {
	const { ownerId } = await GetAccountInfo()
	const token = WebTokenGenerator({
		ownerId,
		browserId: await getToken(),
	})

	window.open(`${CONSTs.FRONTEND}/history?token=${token}`, '_blank')
}

const getDeviceInfo = async () => {
	let token: string = await getToken()

	if (!token) {
		// No Token, it's the first time the user is using the extension
		const newToken = nanoid(32)
		await setToken(newToken)
		token = newToken
	}
	const device = await getBrowserInfo()

	return {
		token,
		device,
	}
}
export { DashboardOpen, getDeviceInfo }
