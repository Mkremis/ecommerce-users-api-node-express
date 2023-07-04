import { Router } from "express";
import { checkSession } from "../middlewares/checkSession.js";
import { isUser } from "../middlewares/isUser.js";
import {
  login,
  updateUser,
  register,
  getUserData,
} from "../controllers/users.controller.js";
import { handleRefreshToken } from "../controllers/refreshToken.controller.js";

const router = Router();
router
  .post("/users/refresh", handleRefreshToken)
  .post("/users/login", isUser, login)
  .post("/users/dashboard/:username", checkSession, getUserData)
  .post("/users/register", isUser, register)
  .put("/users/update", updateUser);

export default router;
