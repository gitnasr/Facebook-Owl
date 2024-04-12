import {ICookie, IImageDoc, IImagePayload, IProfilePicture} from '@/types';

import {CloudinaryService} from '.';
import {Image} from '@/models';
import axios from 'axios';
import {config} from '@/config';
import {nanoid} from 'nanoid';

/**
 * Retrieves the profile picture for a given account ID from Facebook.
 * 
 * @param accountId - The ID of the account.
 * @param cookies - An array of cookies to be included in the request headers.
 * @param shouldCon - Optional. Specifies whether to continue processing the image after retrieval. Defaults to true.
 * @returns A Promise that resolves to an object containing the profile picture URL, hash, and ID, or undefined if the picture cannot be retrieved.
 */
export const getProfilePicture = async (accountId: number, cookies: ICookie[], shouldCon: boolean = true): Promise<IProfilePicture | undefined> => {
	try {
		let url = `https://graph.facebook.com/${accountId}/picture?width=1080&access_token=${config.facebook.accessToken}`;

		const response = await axios.get(url, {
			headers: {
				cookie: cookies.map(c => `${c.name}=${c.value}`).join(';')
			}
		});
		if (response.status !== 200) return undefined;
		const pp: string = response.request.res.responseUrl;
		if (!shouldCon) return {hash: '', id: '', url: pp};
		const hash = await CloudinaryService.getImageHash(pp);
		if (!hash) return undefined;
		const existingImage = await findByHashAndAccountId(hash, accountId);

		if (existingImage) {
			return {
				url: existingImage.cloud,
				hash,
				id: existingImage.imageId
			};
		}

		const cloud_info = await CloudinaryService.uploadImage(pp, accountId.toString());
		if (cloud_info) {
			const imageId = nanoid(32);
			createHashed({
				imageId,
				hash,
				cloud: cloud_info.url,
				originalURL: pp,
				etag: cloud_info.etag,
				public_id: cloud_info.public_id,
				accountId
			});
			return {
				url: cloud_info.url,
				hash,
				id: imageId
			};
		}
		return undefined;
	} catch (error) {
		return undefined;
	}
};

export const findByHashAndAccountId = async (hash: string, accountId: number): Promise<IImageDoc | null> => {
	return Image.findOne({
		hash,
		accountId
	});
};
const createHashed = async (payload: IImagePayload): Promise<IImageDoc> => {
	return Image.create({
		...payload
	});
};
export const findByAccountId = async (accountId: number): Promise<IImageDoc | null> => {
	return Image.findOne({accountId}).sort({createdAt: -1}) || null;
}