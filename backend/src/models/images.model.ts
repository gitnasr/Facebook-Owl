import {IMAGE} from '@/types';
import mongoose from 'mongoose';

const Schema = new mongoose.Schema<IMAGE.IImageDoc, IMAGE.IImageModel>(
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

const Image = mongoose.model<IMAGE.IImageDoc, IMAGE.IImageModel>('Image', Schema);

export default Image;
