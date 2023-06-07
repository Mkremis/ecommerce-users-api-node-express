import { Router } from "express";
import { checkSession } from "../middlewares/checkSession.js";
import { createOrder, failure, pending, receiveWebhook } from "../controllers/payment.controller.js";

  const router = Router();
  router.post('/create-order', checkSession, createOrder)
  router.get('/pending', pending)
  router.get('/failure', failure)
  router.post('/webhook', receiveWebhook)

  export default router;