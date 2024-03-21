import { Router } from "express";
import { checkSession } from "../middlewares/checkSession.js";
import {
  createLike,
  deleteLike,
  getLikes,
} from "../controllers/likes.controller.js";
const router = Router();

router
  .get("/likes", checkSession, getLikes)
  .post("/likes", checkSession, createLike)
  .delete("/likes/:prodId", checkSession, deleteLike);

export default router;
