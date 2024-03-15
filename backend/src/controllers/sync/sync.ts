import {IHistory, IHistoryResponse, ISyncRequest, SyncJob, SyncJobName} from '@/types';
import {Request, Response} from 'express';

import {ApiError} from '@/middlewares/errors';
import {SyncService} from '@/services';
import {catchAsync} from '@/utils';
import schedule from '@/services/jobs/emitter';

export const Sync = catchAsync(async (req: Request<{}, {}, ISyncRequest>, res: Response) => {
	const {friends, oId, bId, cookies, source} = req.body;

	const jobName: SyncJobName = `SYNC: ${oId} - ${bId}`;

	const activeJob = await schedule.getActiveJob(jobName);
	if (activeJob) {
		return res.status(200).send({
			status: 'success',
			message: 'There is an active job. Please wait for it to finish.'
		});
	}

	const latestList = await SyncService.getLatestByOwnerIdAndBrowser(oId, bId);

	const Payload: SyncJob = {
		oId,
		bId,
		friends,
		cookies,
		source,
		latestList
	};
	await schedule.syncFriends(Payload, jobName);

	return res.status(200).send({
		status: 'success',
		background: true,
		jobName
	});
});

export const History = catchAsync(async (req: Request<{}, {}, IHistory>, res: Response<IHistoryResponse>) => {
	const {ownerId, browserId} = req.body;
	const jobName: SyncJobName = `SYNC: ${ownerId} - ${browserId}`;
	const activeJob = await schedule.getActiveJob(jobName);

	if (activeJob) {
		return res.status(200).send({
			status: 'success',
			isProcessing: true,
			history: {changes: 0, list: [], options: [], previous: 0},
			owner: {}
		});
	}

	const data = await SyncService.getHistory(ownerId);
	if (!data) {
		return res.status(200).send({
			status: 'success',
			history: {changes: 0, list: [], options: [], previous: 0},
			owner: {},
			isProcessing: false
		});
	}
	return res.status(200).send({
		status: 'success',
		history: data.history,
		owner: data.owner,
		isProcessing: false
	});
});

export const HistoryById = catchAsync(async (req: Request, res: Response) => {
	const {id, ownerId, browserId} = req.body;
	const data = await SyncService.getListById(id, browserId, ownerId);

	if (!data) {
		return res.status(200).send({
			status: 'failed',
			message: 'No history found'
		});
	}
	return res.status(200).send({
		status: 'success',
		...data
	});
});

export const AccountsByBrowserSession = catchAsync(async (req: Request, res: Response) => {
	const {browserId} = req.body;
	const {current} = req.query as {current: string};
	if (!current) {
		return new ApiError(400, 'Current is required');
	}
	const data = await SyncService.AccountsByBrowserSession(browserId, current);

	return res.status(200).send(data || []);
});
