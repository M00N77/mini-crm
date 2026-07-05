import { Router } from 'express';
import * as controllerAuth from '../controllers/auth';
import { asyncHandler } from '../utils/asyncHandler';
import * as middlewareAuth from '../middleware/auth'
import {rateLimit} from "../middleware/rateLimit";
import {verificationRefreshToken} from "../middleware/auth";

const router = Router();
router.post('/register',rateLimit,asyncHandler(controllerAuth.registerUser))
router.post('/login', rateLimit,asyncHandler(controllerAuth.loginUser))
router.post('/refresh', verificationRefreshToken,rateLimit,middlewareAuth.verificationRefreshToken,asyncHandler(controllerAuth.refreshUser))
router.post('/logout',asyncHandler(controllerAuth.logoutUser))
export default router;