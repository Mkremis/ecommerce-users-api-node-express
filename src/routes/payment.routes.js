import { Router } from "express";
import { checkSession } from "../middlewares/checkSession.js";
import {
  createOrderController,
  failure,
  pending,
  receiveWebhook,
  success,
} from "../controllers/payment.controller.js";

const router = Router();
router.post("/create-order", checkSession, createOrderController);
router.post("/webhook", receiveWebhook);
router.get("/pending", pending);
router.get("/failure", failure);
router.get("/success", success);

export default router;
