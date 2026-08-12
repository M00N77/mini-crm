import { Router } from 'express';
import * as tasksController from '../controllers/tasks';
import { verificationAccessToken } from '../middleware/auth';
import { validateUser } from '../middleware/validateUser';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from "../middleware/validate";
import { validateId } from "../middleware/validateId";
import { createTaskSchema, updateTaskSchema, patchTaskSchema } from "../schemas/tasks.schema";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Tasks management
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Retrieve a list of tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: A list of tasks.
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     responses:
 *       201:
 *         description: Task created successfully.
 */

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task found.
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task updated successfully.
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task deleted successfully.
 */

router.get('/', verificationAccessToken, validateUser, asyncHandler(tasksController.getTasks));
router.get('/:id', verificationAccessToken, validateUser, validateId, asyncHandler(tasksController.getTaskById))
router.post('/', verificationAccessToken, validateUser, validate(createTaskSchema), asyncHandler(tasksController.createTask));
router.put('/:id', verificationAccessToken, validateUser, validateId, validate(updateTaskSchema), asyncHandler(tasksController.updateTask));
router.patch('/:id', verificationAccessToken, validateUser, validateId, validate(patchTaskSchema), asyncHandler(tasksController.patchTask));
router.delete('/:id', verificationAccessToken, validateUser, validateId, asyncHandler(tasksController.deleteTask));

export default router;