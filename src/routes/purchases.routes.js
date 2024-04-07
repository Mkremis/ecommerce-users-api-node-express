import { Router } from "express";
import { checkSession } from "../middlewares/checkSession.js";
import {
  getPurchasesByTrIdController,
  getUserPurchasesController,
} from "../controllers/purchase.controller.js";

const router = Router();
router.get("/purchases", checkSession, getUserPurchasesController);
router.get(
  "/purchases/:transactionId",
  checkSession,
  getPurchasesByTrIdController
);

export default router;
