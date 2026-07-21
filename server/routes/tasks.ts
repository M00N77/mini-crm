import { Router } from 'express';
import * as tasksController from '../controllers/tasks';
import { verificationAccessToken } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from "../middleware/validate";
import { createTaskSchema, updateTaskSchema } from "../schemas/tasks.schema";

const router = Router();

router.get('/', verificationAccessToken, asyncHandler(tasksController.getTasks));
router.get('/:id', verificationAccessToken, asyncHandler(tasksController.getTaskById))
router.post('/', verificationAccessToken, validate(createTaskSchema), asyncHandler(tasksController.createTask));
router.put('/:id', verificationAccessToken, validate(updateTaskSchema), asyncHandler(tasksController.updateTask));
router.delete('/:id', verificationAccessToken, asyncHandler(tasksController.deleteTask));

export default router;