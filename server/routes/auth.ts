import { Router } from 'express';
import * as controllerAuth from '../controllers/auth';
import { asyncHandler } from '../utils/asyncHandler';
import {verificationToken} from "../middleware/auth";

const router = Router();
router.post('/register',asyncHandler(controllerAuth.registerUser))
router.post('/login', asyncHandler(controllerAuth.loginUser))
router.post('/refresh', asyncHandler(controllerAuth.refreshUser))
export default router;