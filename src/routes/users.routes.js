import { Router } from "express";
import { checkSession } from "../middlewares/checkSession.js";
import { isUser } from "../middlewares/isUser.js";
import {
  login,
  updateUser,
  register,
  getUserData,
} from "../controllers/users.controller.js";

const router = Router();

router
  .get("/users/:username", checkSession, getUserData)
  .post("/users/login", isUser, login)
  .post("/users/register", isUser, register)
  .put("/users/update", updateUser);

export default router;
