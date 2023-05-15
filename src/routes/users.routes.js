import { Router } from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/users.controller.js";
import { isUser } from "../middlewares/isUser.js";
import { encryptPass } from "../middlewares/encryptPass.js";
const router = Router();

router
  .get("/users", getUsers)
  .get("/users/:username", getUser)
  .post("/users/:username", isUser, encryptPass, createUser)
  .put("/users/:username", updateUser)
  .delete("/users/:username", deleteUser);

export default router;
