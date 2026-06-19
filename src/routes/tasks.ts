import { Router } from 'express';
import * as tasksController from '../controllers/tasks';
import { verificationToken } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', verificationToken, asyncHandler(tasksController.getTasks));
router.get('/:id', verificationToken, asyncHandler(tasksController.getTaskByIdAndUserId))
router.post('/', verificationToken, asyncHandler(tasksController.createTask));
router.put('/:id', verificationToken, asyncHandler(tasksController.updateTask));
router.delete('/:id', verificationToken, asyncHandler(tasksController.deleteTask));

export default router;