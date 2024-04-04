// Step 1: Import the parts of the module you want to use
import { MercadoPagoConfig, Preference } from "mercadopago";
import { ENDPOINT, MERCADOPAGO_API_KEY } from "../config.js";

import db from "../index.js";
import { deleteCartService } from "../services/cart.services.js";
import { registerUserPurchaseService } from "../services/purchase.services.js";

// import { registerSale } from '../services/payment.services.js';

export const createOrderController = async (req, res) => {
  try {
    // const URL = req.protocol + "://" + req.get("host");

    const userId = req.user.id;
    const order = req.body;
    const userData = await db.getUserById({ userId });
    if (userData.success && Array.isArray(order) && order.length > 0) {
      const { userName, email } = userData.success;

      // Step 2: Initialize the client object
      const client = new MercadoPagoConfig({
        accessToken: MERCADOPAGO_API_KEY,
      });
      const preference = new Preference(client);
      // Step 3: Create an item object
      const items = order.map((item) => ({
        id: item.prodId,
        title: item.prodName,
        unit_price: item.prodPrice,
        quantity: item.productQ,
        currency_id: item.priceCurrency,
        picture_url: `https://${item.prodImage}`,
        category_id: item.prodGender,
        description: item.prodName,
      }));

      preference
        .create({
          body: {
            back_urls: {
              success: `https://mkremis.github.io/ecommerce-react/#/transaction`,
              failure: `${ENDPOINT}/api/users/failure`,
              pending: `${ENDPOINT}/api/users/pending`,
            },
            auto_return: "approved",
            notification_url: `${ENDPOINT}/api/users/webhook`,
            payer: {
              email: email,
              name: userName,
            },
            items,
            external_reference: userId,
          },
        })
        .then((response) => {
          res.status(200).json({ payLink: response.init_point });
        })
        .catch((error) => {
          console.error("Error creating preference:", error);
          res.status(500).json({ error: "Error creating preference" });
        });
    } else {
      res.status(400).json({ error: "Invalid request or empty order" });
    }
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const receiveWebhook = async (req, res) => {
  try {
    const payment = req.body;
    if (payment.type === "payment") {
      // Aquí deberías registrar el pago en tu sistema y actualizar el estado del pedido
      console.log("Payment received:", payment);

      const paymentId = payment.data.id;

      try {
        const response = await fetch(
          `https://api.mercadopago.com/v1/payments/${paymentId}`,
          {
            headers: {
              Authorization: `Bearer ${MERCADOPAGO_API_KEY}`,
            },
          }
        );
        if (response.ok) {
          const paymentData = await response.json();
          const paymentStatus = paymentData.status_detail;
          if (paymentStatus === "accredited") {
            const userId = paymentData?.external_reference;
            await registerUserPurchaseService({ userId, paymentData });
            await deleteCartService({ userId });
            res.sendStatus(201);
          }
        }
      } catch (error) {
        console.error("Error fetching payment data:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const success = async (req, res) => {
  res.status(200).json({ message: "Success payment!!" });
};

export const failure = (req, res) => {
  res.status(400).json({ message: "Payment failure" });
};

export const pending = (req, res) => {
  res.status(200).json({ message: "Payment pending" });
};

//Cuentas de prueba

//COMPRADOR
//User: TEST44562
//Pass: Of9seevw8u

//VENDEDOR
//User: TETEE11591
//Pass: NEUqO9Riik
