import { Router } from "express";
import {
  login,
  updateUser,
  deleteUser,
  register,
  getUserData,
} from "../controllers/users.controller.js";
import { isUser } from "../middlewares/isUser.js";

const router = Router();

router
  .get("/users/:username", getUserData)
  .post("/users/login", isUser, login)
  .post("/users/register", isUser, register)
  .put("/users/:username", updateUser)
  .delete("/users/:username", deleteUser);

export default router;
