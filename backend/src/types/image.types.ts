import {Document, Model} from 'mongoose';

interface IImage {
	originalURL: string;
	cloud: string;
	public_id: string;
	etag: string;
	hash: string;
	imageId: string;
	accountId: number;
}
export interface IImagePayload extends IImage {}
export interface IImageDoc extends IImage, Document {}
export interface IImageModel extends Model<IImageDoc> {}
