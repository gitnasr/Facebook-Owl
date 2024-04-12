import '../../global.css'

import { Authentication } from '../contentScript'
import { FaSync } from 'react-icons/fa'
import Loading from '../components/Loading'
import { SyncSource } from '../types/enum'
import moment from 'moment'
import { useFriends } from '../hooks/useFriends'

export const Popup = () => {
	const { isLoading, state, info, refetch } = useFriends()

	const ForceReSync = async () => refetch(true, SyncSource.MANUALLY)

	if (isLoading) return <Loading />

	return (
		<main className="p-8 min-w-max">
			<div className="relative card">
				<div className="w-max card-body">
					<div className="flex flex-col gap-2">
						<div className="flex justify-center my-2">
							<img src="/icons/logo.png" className="cursor-pointer w-14 " />
						</div>
						{!info?.id && !isLoading ? (
							<div>No Facebook Account Detected</div>
						) : (
							<>
								<div className="flex flex-row items-center justify-between gap-4 ">
									<div className="flex flex-row items-center gap-4">
										<div className="avatar avatar-ring-primary">
											<img src={info?.profilePicture} alt="avatar" />
										</div>

										<div className="flex flex-col">
											<h1
												onClick={Authentication.DashboardOpen}
												className="cursor-pointer hover:underline"
											>
												{info?.name}
											</h1>
											<h3 className="text-xs text-gray-500">
												Next Refresh{' '}
												{moment(state?.nextRefresh).format('hh:mma')}
											</h3>
										</div>
									</div>
									<div className="flex flex-col">
										<h2 className="text-lg text-slate-300">{state?.count}</h2>
										<h3 className="text-xs text-center text-slate-500">
											{state?.change === 0
												? '+/-0'
												: state?.change !== 0
													? state?.change
													: ''}
										</h3>
									</div>
								</div>
								<div className="card-footer">
									<div className="flex flex-col items-center justify-between gap-4">
										<button
											onClick={ForceReSync}
											className="absolute right-0 -top-2 btn btn-circle btn-solid-primary"
										>
											<FaSync className="w-3 h-3" />
										</button>
										<p className="mt-4 text-xs text-center text-slate-400">
											Your friends list has been synced with our servers.
											<br /> Last synced{' '}
											{moment(state?.lastRefresh).fromNow()}
										</p>
									</div>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
			<div className="my-2">
				<small className="flex justify-center m-auto text-center">
					By using this Extension, you implicitly agree to all{' '}
					<a
						href="https://owl.gitnasr.com/privacy"
						target="_blank"
						referrerPolicy="no-referrer"
						className="ml-1 text-gray-300 underline "
					>
						privacy policy
					</a>
					.
				</small>
			</div>
		</main>
	)
}

export default Popup
