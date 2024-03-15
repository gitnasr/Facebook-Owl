import { IImageDoc, IImageModel } from '@/types';

import mongoose from 'mongoose';

const Schema = new mongoose.Schema<IImageDoc, IImageModel>(
	{
		originalURL: String,
		cloud: String,
		public_id: String,
		etag: String,
		hash: String,
		imageId: String,
		accountId: Number
	},
	{
		timestamps: true,
		versionKey: false
	}
);

const Image = mongoose.model<IImageDoc, IImageModel>('Image', Schema);

export default Image;
