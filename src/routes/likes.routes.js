import { Router } from "express";
import { checkSession } from "../middlewares/checkSession.js";
import { getLikes, updateLikes } from "../controllers/likes.controller.js";
const router = Router();

router
  .get("/users/:username/likes", checkSession, getLikes)
  .put("/users/:username/update-likes", checkSession, updateLikes);

export default router;
