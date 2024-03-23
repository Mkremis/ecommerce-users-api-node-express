import { Router } from "express";
import { checkSession } from "../middlewares/checkSession.js";
import {
  deleteCartItem,
  updateCartItem,
} from "../controllers/cart.controller.js";
const router = Router();

router
  .put("/cart", checkSession, updateCartItem)
  .delete("/cart/:cartId", checkSession, deleteCartItem);

export default router;
