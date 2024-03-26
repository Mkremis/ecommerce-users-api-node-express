import { Router } from "express";
import { checkSession } from "../middlewares/checkSession.js";
import {
  createLikeController,
  deleteLikeController,
  getLikesController,
} from "../controllers/likes.controller.js";
const router = Router();

router
  .get("/likes", checkSession, getLikesController)
  .post("/likes", checkSession, createLikeController)
  .delete("/likes/:prodId", checkSession, deleteLikeController);

export default router;
