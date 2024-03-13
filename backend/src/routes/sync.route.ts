import express, {Router} from 'express';

import {syncController} from '@/controllers';
import {Sync} from '@/middlewares';

const router: Router = express.Router();

router.post('/', Sync.ValidateFriendsPayload, syncController.Sync);
router.get('/history', Sync.ValidateHistoryToken, syncController.History);
router.get('/history/:id', syncController.HistoryById);
export default router;
