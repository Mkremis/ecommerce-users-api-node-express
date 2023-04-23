import { Router } from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/users.controller.js";
const router = Router();

router
  .get("/users", getUsers)
  .get("/users/:username", getUser)
  .post("/users/:username", createUser)
  .put("/users/:username", updateUser)
  .delete("/users/:username", deleteUser);

export default router;
