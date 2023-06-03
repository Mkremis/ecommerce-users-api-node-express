import { Router } from "express";
import {
  getUsers,
  login,
  updateUser,
  deleteUser,
  register,
} from "../controllers/users.controller.js";
import { isUser } from "../middlewares/isUser.js";

const router = Router();

router
  .get("/users", getUsers)
  .post("/users/login", isUser, login)
  .post("/users/register", isUser, register)
  .put("/users/:username", updateUser)
  .delete("/users/:username", deleteUser);

export default router;
