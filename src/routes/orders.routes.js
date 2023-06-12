import { Router } from "express";
import { getUserOrders } from "../controllers/orders.controller.js";

const router = Router();
router.get("/orders/:username", getUserOrders);
export default router;
