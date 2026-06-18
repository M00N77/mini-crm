import { Router } from 'express';
import * as tasksController from '../controllers/tasks';
import { verificationToken } from '../middleware/auth';

const router = Router();

router.get('/', verificationToken, tasksController.getTasks);
router.get('/:id', verificationToken, tasksController.getTaskByIdAndUserId)
router.post('/', verificationToken, tasksController.createTask);
router.put('/:id', verificationToken, tasksController.updateTask);
router.delete('/:id', verificationToken, tasksController.deleteTask);

export default router;