import { Router } from "express";
import { getUserOrders } from "../controllers/orders.controller.js";
import { checkSession } from "../middlewares/checkSession.js";

const router = Router();
router.post("/users/:username/orders", checkSession, getUserOrders);
export default router;
