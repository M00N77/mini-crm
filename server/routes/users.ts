import { Router } from "express";
import * as userController from "../controllers/users";
import { verificationAccessToken } from "../middleware/auth";
import { validateUser } from "../middleware/validateUser";
import { validate } from "../middleware/validate";
import { validateId } from "../middleware/validateId";
import { asyncHandler } from "../utils/asyncHandler";
import { createUserSchema } from "../schemas/users.schema";

const router = Router();

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
// TODO(review): POST /users дублирует registerUser (без выдачи токенов); нужен admin-контроль или удалить
router.post(
  "/",
  verificationAccessToken,
  validateUser,
  validate(createUserSchema),
  asyncHandler(userController.createUser),
);

export default router;
