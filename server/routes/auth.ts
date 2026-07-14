import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import * as controllerAuth from "../controllers/auth";
import { asyncHandler } from "../utils/asyncHandler";
import * as middlewareAuth from "../middleware/auth";
import { verificationRefreshToken } from "../middleware/auth";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Слишком много запросов. Пожалуйста, попробуйте позже.",
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();
router.post(
  "/register",
  authLimiter,
  asyncHandler(controllerAuth.registerUser),
);
router.post("/login", authLimiter, asyncHandler(controllerAuth.loginUser));
router.post(
  "/refresh",
  verificationRefreshToken,
  asyncHandler(controllerAuth.refreshUser),
);
router.post("/logout", authLimiter, asyncHandler(controllerAuth.logoutUser));
router.post(
  "/changepass",
  middlewareAuth.verificationAccessToken,
  authLimiter,
  middlewareAuth.checkNewPasswordDiffers,
  middlewareAuth.verifyOldPassword,
  asyncHandler(controllerAuth.changePassword),
);
export default router;
