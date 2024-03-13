import { AUTH, LIST } from '@/types';
import { Request, Response } from 'express';

import { SyncService } from '@/services';
import { catchAsync } from '@/utils';
import schedule from '@/services/jobs/emitter';

export const Sync = catchAsync(async (req: Request<{}, {}, LIST.ISyncRequest>, res: Response) => {


	const {friends, oId, bId, cookies, source} = req.body;
	
	const jobName: string = `SYNC: ${oId} - ${bId}`
	
	
	const activeJob = await schedule.getActiveJob(jobName);
	if (activeJob.length > 0) {
		return res.status(200).send({
			status: 'success',
			message: 'There is an active job. Please wait for it to finish.'
		});
	}

	const latestList = await SyncService.getLatestByOwnerIdAndBrowser(oId, bId);


	

	const Payload: LIST.SyncJob = {
		oId,
		bId,
		friends,
		cookies,
		source,
		latestList
	}
	await schedule.syncFriends(Payload, jobName);

	return res.status(200).send({
		status: 'success',
		background: true,
		jobName
	});
	
});

export const History = catchAsync(async (req: Request<{}, AUTH.IHistory>, res: Response) => {
	const {ownerId} = req.body;

	const data = await SyncService.getHistory(ownerId);
	if (!data) {
		return res.status(200).send({
			status: 'failed',
			message: 'No history found'
		});
	}
	return res.status(200).send({
		status: 'success',
		history: data.history,
		owner: data.owner
	});
});

export const HistoryById = catchAsync(async (req: Request, res: Response) => {
	// TODO: implement JWT
	const {id} = req.params;
	const {oId} = req.query as {oId: string};
	const data = await SyncService.getListById(id, oId);
	
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
