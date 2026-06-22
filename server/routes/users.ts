import { Router } from 'express';
import * as userController from '../controllers/users';
import { verificationToken } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', verificationToken, rateLimit, asyncHandler(userController.getUsers));
router.get('/:id', verificationToken, rateLimit, asyncHandler(userController.getUser));
router.delete('/:id', verificationToken, rateLimit, asyncHandler(userController.deleteUser));


export default router;
