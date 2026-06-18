import { Router } from 'express';
import * as userController from '../controllers/users';
import { virificationToken } from '../middleware/auth';

const router = Router();

router.get('/', virificationToken, userController.getUsers);
router.get('/:id', virificationToken, userController.getUser);
router.post('/', userController.createUser);
router.delete('/:id', virificationToken, userController.deleteUser);


export default router;
