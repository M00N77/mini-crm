import { Router } from 'express';
import * as tasksController from '../controllers/tasks';
import { verificationAccessToken } from '../middleware/auth';
import { validateUser } from '../middleware/validateUser';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from "../middleware/validate";
import { validateId } from "../middleware/validateId";
import { createTaskSchema, updateTaskSchema } from "../schemas/tasks.schema";

const router = Router();

router.get('/', verificationAccessToken, validateUser, asyncHandler(tasksController.getTasks));
router.get('/:id', verificationAccessToken, validateUser, validateId, asyncHandler(tasksController.getTaskById))
router.post('/', verificationAccessToken, validateUser, validate(createTaskSchema), asyncHandler(tasksController.createTask));
router.put('/:id', verificationAccessToken, validateUser, validateId, validate(updateTaskSchema), asyncHandler(tasksController.updateTask));
router.delete('/:id', verificationAccessToken, validateUser, validateId, asyncHandler(tasksController.deleteTask));

export default router;