import { Router } from 'express';
import * as tasksController from '../controllers/tasks';

const router = Router();

router.get('/',tasksController.getTasks);
router.get('/:id',tasksController.getTaskByIdAndUserId)
router.post('/',tasksController.createTask);
router.put('/:id',tasksController.updateTask);
router.delete('/:id',tasksController.deleteTask);

export default router;