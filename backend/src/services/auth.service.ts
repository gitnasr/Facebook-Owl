import {IUserDoc} from '@/types';
import {User} from '@/models';

export const findByBrowserId = async (browserId: string): Promise<IUserDoc | null> => {
	return await User.findOne({
		browserId
	});
};

export const createUser = async (browserId: string, browserVersion: number, browserType: string, country:string): Promise<IUserDoc> => {
	return await User.create({
		browserId,
		browserVersion,
		browserType,
		country
	});
};
