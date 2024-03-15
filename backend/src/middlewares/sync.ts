import {BlacklistTokenKey, IHistory, IOwnerPayload, ISyncRequest} from '@/types';
import {NextFunction, Request, Response} from 'express';

import {ApiError} from './errors';
import { RedisService } from '@/services/jobs';
import _ from 'underscore';
import {config} from '@/config';
import crypto from 'crypto-js';
import httpStatus from 'http-status';
import jsonwebtoken from 'jsonwebtoken';
import moment from 'moment';

export const ValidateAccountInfo = async (req: Request, _res: Response, next: NextFunction) => {
	try {
		const {info} = req.body;

		// isTokenBlacklisted
		const isBlacklisted = await isTokenBlacklisted(BlacklistTokenKey.LoginToken, info);
		if (isBlacklisted) {
			return next(new ApiError(httpStatus.UNAUTHORIZED, 'Token is Already Used or Expired'));
		}
		const Bytes = crypto.AES.decrypt(info.toString(), config.jwt.extensionPayloadSecret, {
			format: crypto.format.OpenSSL
		});
		const decrypted_string = Bytes.toString(crypto.enc.Utf8);
		const Payload: IOwnerPayload = JSON.parse(decrypted_string);
		await blacklistToken(BlacklistTokenKey.LoginToken, info, Payload.expiresAt);
		if (moment().isAfter(Payload.expiresAt)) {
			return next(new ApiError(httpStatus.UNAUTHORIZED, 'Token Expired'));
		}

		req.body = {
			..._.omit(Payload, ['expiresAt'])
		};
		next();
	} catch (error) {
		next(error);
	}
};

export const ValidateHistoryToken = async (req: Request, _res: Response, next: NextFunction) => {
	try {
		const {token} = req.query;
		if (!token) return next(new ApiError(httpStatus.UNAUTHORIZED, 'Token is required'));
		const payload = jsonwebtoken.verify(token.toString(), config.jwt.extensionSecret) as IHistory;
		req.body = payload;
		next();
	} catch (error) {
		next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Token'));
	}
};

export const ValidateFriendsPayload = async (req: Request, _res: Response, next: NextFunction) => {
	try {
		const {payload} = req.body;
		if (!payload) return next(new ApiError(httpStatus.UNAUTHORIZED, 'Token is required'));
		const isBlacklisted = await isTokenBlacklisted(BlacklistTokenKey.SyncToken, payload);
		if (isBlacklisted) {
			return next(new ApiError(httpStatus.UNAUTHORIZED, 'Payload is Already Used or Expired'));
		}
		const decrypted_string = crypto.AES.decrypt(payload, config.jwt.extensionPayloadSecret).toString(crypto.enc.Utf8);
		const Payload: ISyncRequest = JSON.parse(decrypted_string);
		await blacklistToken(BlacklistTokenKey.SyncToken, payload, Payload.expiresAt);
		req.body = {
			..._.omit(Payload, ['expiresAt'])
		};

		next();
	} catch (error) {
		next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Token'));
	}
};

export const ValidateHistoryById = async (req: Request, _res: Response, next: NextFunction) => {
	try {
		const {id} = req.params;

		if (!id) return next(new ApiError(httpStatus.BAD_REQUEST, 'Invalid Data'));
		const header = req.headers.authorization;
		if (!header) return next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Token'));
		const token = header.split(' ')[1];

		const payload = jsonwebtoken.verify(token.toString(), config.jwt.extensionSecret) as IHistory;

		req.body = {
			...payload,
			id
		};
		next();
	} catch (error) {
		next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Token'));
	}
};
const SearchInBlacklist = async (key: BlacklistTokenKey, token: string): Promise<number | null> => {
	const listLength: number | undefined = await RedisService.llen(key);

	for (let index = 0; index < listLength; index++) {
		// Get the value at the current index
		const currentValue = await RedisService.lindex(key, index);

		// Check if the current value matches the value we're searching for
		if (currentValue === token) {
			// Return the index if found
			return index;
		}
	}
	return null;
};
const isTokenBlacklisted = async (key: BlacklistTokenKey, token: string): Promise<Boolean> => {
	const index = await SearchInBlacklist(key, token);
	return index !== null;
};

const blacklistToken = async (key: BlacklistTokenKey, token: string, expireAt: string) => {
	await RedisService.rpush(key, token);
	await RedisService.expire(key, moment(expireAt).diff(moment(), 'minutes'));
};
