import { Router } from "express";
import { checkSession } from "../middlewares/checkSession.js";
import { getTransactionController } from "../controllers/transactions.controller.js";

const router = Router();
router.get(
  "/transaction/:transactionId",
  checkSession,
  getTransactionController
);

export default router;
