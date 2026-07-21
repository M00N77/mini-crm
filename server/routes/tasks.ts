import { Router } from 'express';
import * as tasksController from '../controllers/tasks';
import { verificationAccessToken } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from "../middleware/validate";
import { validateId } from "../middleware/validateId";
import { createTaskSchema, updateTaskSchema } from "../schemas/tasks.schema";

const router = Router();

router.get('/', verificationAccessToken, asyncHandler(tasksController.getTasks));
router.get('/:id', verificationAccessToken, validateId, asyncHandler(tasksController.getTaskById))
router.post('/', verificationAccessToken, validate(createTaskSchema), asyncHandler(tasksController.createTask));
router.put('/:id', verificationAccessToken, validateId, validate(updateTaskSchema), asyncHandler(tasksController.updateTask));
router.delete('/:id', verificationAccessToken, validateId, asyncHandler(tasksController.deleteTask));

export default router;