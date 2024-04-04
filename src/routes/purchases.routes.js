import { Router } from "express";
import { checkSession } from "../middlewares/checkSession.js";
import { getUserPurchasesController } from "../controllers/purchase.controller.js";

const router = Router();
router.get("/purchases", checkSession, getUserPurchasesController);

export default router;
