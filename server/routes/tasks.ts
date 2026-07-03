import { Router } from 'express';
import * as tasksController from '../controllers/tasks';
import { verificationAccessToken } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', verificationAccessToken, rateLimit, asyncHandler(tasksController.getTasks));
router.get('/:id', verificationAccessToken, rateLimit, asyncHandler(tasksController.getTaskByIdAndUserId))
router.post('/', verificationAccessToken, rateLimit, asyncHandler(tasksController.createTask));
router.put('/:id', verificationAccessToken, rateLimit, asyncHandler(tasksController.updateTask));
router.delete('/:id', verificationAccessToken, rateLimit, asyncHandler(tasksController.deleteTask));

export default router;