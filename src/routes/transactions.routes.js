import { Router } from "express";
import { checkSession } from "../middlewares/checkSession.js";
import {
  getPurchasesByTrIdController,
  getTransactionController,
} from "../controllers/transactions.controller.js";

const router = Router();
router.get(
  "/transaction/:transactionId",
  checkSession,
  getTransactionController
);
router.get(
  "/transaction/:transactionId",
  checkSession,
  getPurchasesByTrIdController
);
export default router;
