import { Router } from "express";
import { checkSession } from "../middlewares/checkSession.js";
import {
  deleteCartItemController,
  updateCartController,
} from "../controllers/cart.controller.js";
const router = Router();

router
  .put("/cart", checkSession, updateCartController)
  .delete("/cart/:cartId", checkSession, deleteCartItemController);

export default router;
