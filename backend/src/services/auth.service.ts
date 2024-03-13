import {User} from '@/models';
import {AUTH} from '@/types';

export const findByBrowserId = async (browserId: string): Promise<AUTH.IUserDoc | null> => {
	return await User.findOne({
		browserId
	});
};

export const createUser = async (browserId: string, browserVersion: number, browserType: string): Promise<AUTH.IUserDoc> => {
	return await User.create({
		browserId,
		browserVersion,
		browserType
	});
};
