import { Router } from "express";
import { createOrder, failure, pending, receiveWebhook, success } from "../controllers/payment.controller.js";

  const router = Router();
  router.get('/create-order', createOrder)
  router.get('/pending', pending)
  router.get('/failure', failure)
  router.get('/success', success)
  router.post('/webhook', receiveWebhook)

  export default router;