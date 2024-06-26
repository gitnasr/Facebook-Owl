import { IProfile, State } from '../types/storage.interfaces'
import { useCallback, useEffect, useState } from 'react'

import { ISync } from '../types/sync.interfaces'
import { SendFriends } from '../contentScript/sync'
import { SyncSource } from '../types/enum'

export const useFriends = () => {
	const [state, setState] = useState<State | null>()
	const [info, setInfo] = useState<IProfile | null>()
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const SyncFriends = useCallback(
		async (skip: boolean = false, source: SyncSource = SyncSource.BY_POP_UP) => {
			chrome.runtime.sendMessage({ type: 'sync', skip }, async (response: ISync) => {
				setIsLoading(true)
				try {
					if (!response) {
						setIsLoading(false)
						return
					}
					setState(response.state)
					setInfo({
						friendsUrl: response.friendsUrl,
						id: response.id,
						name: response.name,
						profilePicture: response.profilePicture,
						ownerId: response.ownerId,
					})
					if (response.friends) {
						await SendFriends(response.friends, source)
					}
				} finally {
					setIsLoading(false)
				}
			})
		},
		[],
	)
	useEffect(() => {
		SyncFriends()
	}, [])
	return {
		state,
		info,
		isLoading,
		refetch: SyncFriends,
	}
}
