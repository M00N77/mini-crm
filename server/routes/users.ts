import { Router } from "express";
import * as userController from "../controllers/users";
import { verificationAccessToken } from "../middleware/auth";
import { validateUser } from "../middleware/validateUser";
import { validateId } from "../middleware/validateId";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users management
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users.
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user info
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Current user information.
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User found.
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully.
 */

// TODO(review): нужен полноценный admin/role-контроль перед тем как этот роут пойдёт в прод
router.get("/", verificationAccessToken, validateUser, asyncHandler(userController.getUsers));

router.get(
  "/me",
  verificationAccessToken,
  validateUser,
  asyncHandler(userController.getUserInfo),
);

router.get(
  "/:id",
  verificationAccessToken,
  validateUser,
  validateId,
  asyncHandler(userController.getUser),
);

router.delete(
  "/:id",
  verificationAccessToken,
  validateUser,
  validateId,
  asyncHandler(userController.deleteUser),
);
export default router;
