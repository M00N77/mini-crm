import { Router } from 'express';
import * as userController from '../controllers/users';
import { verificationAccessToken } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', verificationAccessToken, rateLimit, asyncHandler(userController.getUsers));
router.get('/:id', verificationAccessToken, rateLimit, asyncHandler(userController.getUser));
router.delete('/:id', verificationAccessToken, rateLimit, asyncHandler(userController.deleteUser));


export default router;
