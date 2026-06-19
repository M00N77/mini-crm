import { Router } from 'express';
import * as userController from '../controllers/users';
import { verificationToken } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', verificationToken, asyncHandler(userController.getUsers));
router.get('/:id', verificationToken, asyncHandler(userController.getUser));
router.delete('/:id', verificationToken, asyncHandler(userController.deleteUser));


export default router;
