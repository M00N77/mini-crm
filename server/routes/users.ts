import { Router } from "express";
import * as userController from "../controllers/users";
import { verificationAccessToken } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { validateId } from "../middleware/validateId";
import { asyncHandler } from "../utils/asyncHandler";
import { createUserSchema } from "../schemas/users.schema";

const router = Router();

router.get("/", verificationAccessToken, asyncHandler(userController.getUsers));

router.get(
  "/me",
  verificationAccessToken,
  asyncHandler(userController.getUserInfo),
);

router.get(
  "/:id",
  verificationAccessToken,
  validateId,
  asyncHandler(userController.getUser),
);

router.delete(
  "/:id",
  verificationAccessToken,
  validateId,
  asyncHandler(userController.deleteUser),
);
router.post(
  "/",
  verificationAccessToken,
  validate(createUserSchema),
  asyncHandler(userController.createUser),
);

export default router;
