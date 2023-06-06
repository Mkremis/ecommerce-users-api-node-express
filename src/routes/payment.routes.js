import { Router } from "express";
import { checkSession } from "../middlewares/checkSession.js";
import {
    getCart,
    updateCart,
  } from "../controllers/cart.controller.js";
import { createOrder, failure, pending, receiveWebhook, success } from "../controllers/payments.controller.js";

  const router = Router();
  router.get('/create-order', createOrder)
  router.get('/pending', pending)
  router.get('/failure', failure)
  router.get('/success', success)
  router.post('/webhook', receiveWebhook)

  export default router;