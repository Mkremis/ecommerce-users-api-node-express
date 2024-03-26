import { Router } from "express";
import { checkSession } from "../middlewares/checkSession.js";
import {
  getUserDashboardController,
  updateUserDashboardController,
  logoutController,
  reloadSessionController,
} from "../controllers/users.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { updateSchema } from "../schemas/users.schema.js";

const router = Router();
router
  .get("/logout", checkSession, logoutController)
  .get("/dashboard", checkSession, getUserDashboardController)
  .patch(
    "/dashboard",
    validateSchema(updateSchema),
    checkSession,
    updateUserDashboardController
  )
  .get("/reload", checkSession, reloadSessionController);

export default router;
