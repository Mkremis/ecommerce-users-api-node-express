import { Router } from "express";
import { checkSession } from "../middlewares/checkSession.js";
import {
  updateUser,
  dashboard,
  logout,
  reloadSession,
} from "../controllers/users.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { updateSchema } from "../schemas/users.schema.js";

const router = Router();
router
  .get("/logout", checkSession, logout)
  .get("/dashboard", checkSession, dashboard)
  .patch("/update", validateSchema(updateSchema), checkSession, updateUser)
  .get("/reload", checkSession, reloadSession);

export default router;
