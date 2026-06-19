import { Router } from 'express';
import * as controllerAuth from '../controllers/auth';

const router = Router();
router.post('/register', controllerAuth.registerUser)
router.post('/login', controllerAuth.loginUser)
router.post('/refresh', controllerAuth.refreshUser)
export default router;