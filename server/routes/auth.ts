import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import * as controllerAuth from "../controllers/auth";
import { asyncHandler } from "../utils/asyncHandler";
import * as middlewareAuth from "../middleware/auth";
import { validateUser } from "../middleware/validateUser";
import { verificationRefreshToken } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  registerSchema,
  loginSchema,
  changePassSchema,
} from "../schemas/auth.schema";

const authLimiter =
  process.env.NODE_ENV === "test"
    ? (_req: any, _res: any, next: any) => next()
    : rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 5,
        message: "Too many requests. Please try again later.",
        standardHeaders: true,
        legacyHeaders: false,
      });

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and Authorization
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     responses:
 *       201:
 *         description: User registered successfully.
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Login successful.
 */

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh tokens
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Tokens refreshed.
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful.
 */

/**
 * @swagger
 * /auth/changepass:
 *   post:
 *     summary: Change user password
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Password changed successfully.
 */

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
  validateUser,
  authLimiter,
  middlewareAuth.verifyOldPassword,
  asyncHandler(controllerAuth.changePassword),
);
router.get(
  "/google",
  asyncHandler(controllerAuth.googleAuth),
);
router.get(
  "/google/callback",
  asyncHandler(controllerAuth.googleCallback),
);

export default router;
