import { Router } from 'express';
import * as userController from '../controllers/users';
import { verificationAccessToken } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', verificationAccessToken, asyncHandler(userController.getUsers));
router.get('/:id', verificationAccessToken, asyncHandler(userController.getUser));
router.delete('/:id', verificationAccessToken, asyncHandler(userController.deleteUser));


export default router;
