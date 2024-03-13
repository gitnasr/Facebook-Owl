import { OwnerService, SyncService } from '@/services';
import {Sync, Validation} from '@/middlewares';
import express, {Router} from 'express';

import {Auth} from '@/middlewares/validations';
import {authController} from '@/controllers';

const router: Router = express.Router();

router.post('/login', Validation.Middleware(Auth.InfoValidation), Sync.ValidateAccountInfo, Validation.Middleware(Auth.LoginWithExtension), authController.loginWithExtension);


export default router;
