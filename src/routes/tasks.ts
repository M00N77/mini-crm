import { Router } from 'express';
import * as tasksController from '../controllers/tasks';
import { verificationToken } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', verificationToken, rateLimit, asyncHandler(tasksController.getTasks));
router.get('/:id', verificationToken, rateLimit, asyncHandler(tasksController.getTaskByIdAndUserId))
router.post('/', verificationToken, rateLimit, asyncHandler(tasksController.createTask));
router.put('/:id', verificationToken, rateLimit, asyncHandler(tasksController.updateTask));
router.delete('/:id', verificationToken, rateLimit, asyncHandler(tasksController.deleteTask));

export default router;