import { Router } from "express";
import {
  getUsers,
  login,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/users.controller.js";
import { isUser } from "../middlewares/isUser.js";
const router = Router();

router
  .get("/users", getUsers)
  .post("/users/login", login)
  .post("/users/register", createUser)
  // .post("/users/:username", isUser, createUser)
  .put("/users/:username", updateUser)
  .delete("/users/:username", deleteUser);

export default router;
