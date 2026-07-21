import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import * as controllerAuth from "../controllers/auth";
import { asyncHandler } from "../utils/asyncHandler";
import * as middlewareAuth from "../middleware/auth";
import { verificationRefreshToken } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  registerSchema,
  loginSchema,
  changePassSchema,
} from "../schemas/auth.schema";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many requests. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  authLimiter,
  asyncHandler(controllerAuth.registerUser),
);
router.post(
  "/login",
  validate(loginSchema),
  authLimiter,
  asyncHandler(controllerAuth.loginUser),
);

router.post(
  "/refresh",
  verificationRefreshToken,
  asyncHandler(controllerAuth.refreshUser),
);
router.post("/logout", authLimiter, asyncHandler(controllerAuth.logoutUser));

router.post(
  "/changepass",
  validate(changePassSchema),
  middlewareAuth.verificationAccessToken,
  authLimiter,
  middlewareAuth.checkNewPasswordDiffers,
  middlewareAuth.verifyOldPassword,
  asyncHandler(controllerAuth.changePassword),
);
export default router;
