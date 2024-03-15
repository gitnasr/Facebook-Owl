import express, {Router} from 'express';

import {Sync} from '@/middlewares';
import {syncController} from '@/controllers';

const router: Router = express.Router();

router.post('/', Sync.ValidateFriendsPayload, syncController.Sync);
router.get('/history', Sync.ValidateHistoryToken, syncController.History);
router.get('/history/:id', Sync.ValidateHistoryById, syncController.HistoryById);
router.get("/switch", Sync.ValidateHistoryToken,syncController.AccountsByBrowserSession);
export default router;
