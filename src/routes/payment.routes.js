import { Router } from "express";
import { checkSession } from "../middlewares/checkSession.js";
import {
  createOrderController,
  failPaymentController,
  pendingPaymentController,
  receiveWebhook,
  successPaymentController,
} from "../controllers/payment.controller.js";

const router = Router();
router.post("/create-order", checkSession, createOrderController);
router.post("/webhook", receiveWebhook);
router.get("/pending", pendingPaymentController);
router.get("/failure", failPaymentController);
router.get("/success", successPaymentController);

export default router;
