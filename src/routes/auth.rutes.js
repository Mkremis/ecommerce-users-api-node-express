import { Router } from "express";
import { isUser } from "../middlewares/isUser.js";
import { login, register } from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { loginSchema, registerSchema } from "../schemas/users.schema.js";

const router = Router();

router
  .post("/login", validateSchema(loginSchema), isUser, login)
  .post("/register", validateSchema(registerSchema), isUser, register);

export default router;
