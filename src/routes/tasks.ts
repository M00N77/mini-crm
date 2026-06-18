import { Router } from 'express';
import * as tasksController from '../controllers/tasks';
import { virificationToken } from '../middleware/auth';

const router = Router();

router.get('/', virificationToken, tasksController.getTasks);
router.get('/:id', virificationToken, tasksController.getTaskByIdAndUserId)
router.post('/', virificationToken, tasksController.createTask);
router.put('/:id', virificationToken, tasksController.updateTask);
router.delete('/:id', virificationToken, tasksController.deleteTask);

export default router;