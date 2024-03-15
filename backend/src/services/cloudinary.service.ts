import { ImageResponse } from '@/types';
import {v2 as cloudinary} from 'cloudinary';
import {imageHash} from 'image-hash';
import { nanoid } from 'nanoid';

export const uploadImage = async (ImageURL: string, fileName:string): Promise<ImageResponse | null> => {
	try {
		const result = await cloudinary.uploader.upload(ImageURL, {
			faces: true,
			phash: true,
			public_id: `${fileName}_${nanoid(6)}`,resource_type: 'image'
		});
		return {
			url: result.secure_url,
			etag: result.etag,
			public_id: result.public_id
		};
	} catch (error) {
		return null;
	}
};

export const getImageHash = async (ImageURL: string): Promise<string | undefined> => {
	try {
		return new Promise((resolve, reject) => {
			imageHash(ImageURL, 16, true, (error: Error, data: string) => {
				if (error) reject(error);
				resolve(data);
			});
		});
	} catch (error) {
		return;
	}
};
