import { Router } from 'express';
import * as userController from '../controllers/users';
import { verificationToken } from '../middleware/auth';

const router = Router();

router.get('/', verificationToken, userController.getUsers);
router.get('/:id', verificationToken, userController.getUser);
router.post('/', userController.createUser);
router.delete('/:id', verificationToken, userController.deleteUser);


export default router;
