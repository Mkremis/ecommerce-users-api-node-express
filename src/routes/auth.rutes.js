import { Router } from "express";
import { isUser } from "../middlewares/isUser.js";
import {
  loginController,
  registerController,
} from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { loginSchema, registerSchema } from "../schemas/users.schema.js";

const router = Router();

router
  .post("/login", validateSchema(loginSchema), isUser, loginController)
  .post(
    "/register",
    validateSchema(registerSchema),
    isUser,
    registerController
  );

export default router;
