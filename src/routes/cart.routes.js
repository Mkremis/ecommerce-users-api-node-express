import { Router } from "express";
import {
  getCart,
  updateCart,
} from "../controllers/cart.controller.js";
const router = Router();

router
  .get("/users/:username/cart", getCart)
  .put("/users/:username/update-cart", updateCart)

export default router;
