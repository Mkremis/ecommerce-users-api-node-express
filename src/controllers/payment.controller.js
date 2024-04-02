// Step 1: Import the parts of the module you want to use
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { MERCADOPAGO_API_KEY } from "../config.js";

import db from "../index.js";
// import { cartUpdate } from '../services/cart.services.js';
// import { registerSale } from '../services/payment.services.js';

export const createOrderController = async (req, res) => {
  try {
    const URL = req.protocol + "://" + req.get("host");

    const userId = req.user.id;
    const order = req.body;
    const userData = await db.getUserById({ userId });
    if (userData.success && Array.isArray(order) && order.length > 0) {
      const { userName, email } = userData.success;

      // Step 2: Initialize the client object
      const client = new MercadoPagoConfig({
        accessToken: MERCADOPAGO_API_KEY,
      });

      //  const preference = new Preference(client);
      // Step 3: Create an item object
      const items = order.map(
        ({
          prodId,
          prodName,
          prodPrice,
          prodImage,
          priceCurrency,
          prodGender,
          productQ,
        }) => {
          return {
            id: prodId,
            title: prodName,
            unit_price: prodPrice,
            quantity: productQ,
            currency_id: priceCurrency,
            picture_url: prodImage,
            category_id: prodGender,
            description: prodName,
          };
        }
      );

      const payment = new Payment(client);

      const body = {
        transaction_amount: "100",
        token: "token",
        description: "description",
        installments: 1,
        payment_method_id: "visa",
        notification_url: `${URL}/api/users/webhook`,
        payer: {
          email: "test@test.com",
          identification: {
            type: "CPF",
            number: "19119119100",
          },
        },
      };

      payment
        .create({
          body: body,
          requestOptions: { idempotencyKey: "<SOME_UNIQUE_VALUE>" },
        })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
      // preference
      //   .create({
      //     body: {
      //       notification_url: `${URL}/api/users/webhook`,
      //       back_urls: {
      //         success: `${URL}/api/users/success`,
      //         failure: `${URL}/api/users/failure`,
      //         pending: `${URL}/api/users/pending`,
      //       },
      //       payer: {
      //         email: email,
      //         surname: userName,
      //       },
      //       items,
      //     },
      //   })
      //   .then((response) => {
      //     res.status(200).json({ payLink: response.init_point });
      //   })
      //   .catch((error) => {
      //     console.error("Error creating preference:", error);
      //     res.status(500).json({ error: "Error creating preference" });
      //   });
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
    console.log("Webhook received");

    if (payment.type === "payment") {
      // Aquí deberías registrar el pago en tu sistema y actualizar el estado del pedido
      console.log("Payment received:", payment);
      res.status(200).send("Payment received successfully");
    } else {
      console.log("Invalid payment type");
      res.status(400).send("Invalid payment type");
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

//   if (payment.type === 'payment') {
//     res.status(200).send('HTTP STATUS 200 (OK)');
//     const data = await mercadopago.payment.findById(payment['data.id']);
//     console.log('PAYMENT');
//     await registerSale(
//       data.body.additional_info.items,
//       username,
//       data.body.date_approved,
//       'mercadopago'
//     );
//     console.log('PAYMENT OK!!');
//     await cartUpdate({ username, cart: {} });
//   }
// };
