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

export interface ImageResponse {
	url: string;
	etag: string;
	public_id: string;
}

export type ISimilar = (hash1: string, hash2: string) => Promise<{similer: boolean, per: number}>;
export interface IImagePayload extends IImage {}
export interface IImageDoc extends IImage, Document {}
export interface IImageModel extends Model<IImageDoc> {}
