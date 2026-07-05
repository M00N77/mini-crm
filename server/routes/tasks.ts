import { Router } from 'express';
import * as tasksController from '../controllers/tasks';
import { verificationAccessToken } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', verificationAccessToken, asyncHandler(tasksController.getTasks));
router.get('/:id', verificationAccessToken, asyncHandler(tasksController.getTaskByIdAndUserId))
router.post('/', verificationAccessToken, asyncHandler(tasksController.createTask));
router.put('/:id', verificationAccessToken, asyncHandler(tasksController.updateTask));
router.delete('/:id', verificationAccessToken, asyncHandler(tasksController.deleteTask));

export default router;