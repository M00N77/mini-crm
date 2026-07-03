import { Router } from 'express';
import * as controllerAuth from '../controllers/auth';
import { asyncHandler } from '../utils/asyncHandler';
import * as middlewareAuth from '../middleware/auth'

const router = Router();
router.post('/register',asyncHandler(controllerAuth.registerUser))
router.post('/login', asyncHandler(controllerAuth.loginUser))
router.post('/refresh', middlewareAuth.verificationRefreshToken,asyncHandler(controllerAuth.refreshUser))
export default router;