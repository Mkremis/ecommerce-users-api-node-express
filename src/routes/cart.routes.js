import { Router } from "express";
import { checkSession } from "../middlewares/checkSession.js";
import { getCart, updateCart } from "../controllers/cart.controller.js";
const router = Router();

router
  .use(checkSession)
  .get("/users/:username/cart", checkSession, getCart)
  .put("/users/:username/update-cart", checkSession, updateCart);

export default router;
