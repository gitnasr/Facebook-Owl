import { CONSTs } from '../types/enum'
import DeviceDetector from 'device-detector-js'
import c from 'crypto-js'
import moment from 'moment'
import { nanoid } from 'nanoid'

export const getBrowserInfo = async () => {
	const deviceDetector = new DeviceDetector()
	const userAgent = navigator.userAgent
	const device = deviceDetector.parse(userAgent)

	return device
}

export const getCookiesByWebSite = (url: string): Promise<chrome.cookies.Cookie[]> => {
	return chrome.cookies.getAll({ url: url })
}

export const getToken = async () => {
	const { token } = await chrome.storage.sync.get(['token'])
	return token
}

export const setToken = async (token: string) => {
	await chrome.storage.sync.set({ ['token']: token })
}

export const encryptPayload = async (payload: any, expiresInMin: number = 30) => {
	const secret = CONSTs.CRYPTO.toString()
	payload.expiresAt = moment().add(expiresInMin, 'minute').toISOString()
	const token = c.AES.encrypt(JSON.stringify(payload), secret, {
		format: c.format.OpenSSL,
	}).toString()
	return token
}

export const CreateNotification = (title: string, message: string) => {
	const nId = nanoid(6)
	return chrome.notifications.create(nId, {
		message: message,
		title: title,
		type: 'basic',
		iconUrl: '/img/logo-128.png',
		isClickable: true,
	})
}
