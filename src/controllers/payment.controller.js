// Step 1: Import the parts of the module you want to use
import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import { MERCADOPAGO_API_KEY } from "../config.js";

import db from "../index.js";
// import { cartUpdate } from '../services/cart.services.js';
// import { registerSale } from '../services/payment.services.js';

export const createOrderController = async (req, res) => {
  try {
    const userId = req.user.id;
    const order = req.body;
    const userData = await db.getUserById({ userId });
    if (userData.success && order.length) {
      const { userName, email } = userData.success;

      // Step 2: Initialize the client object
      const client = new MercadoPagoConfig({
        accessToken: MERCADOPAGO_API_KEY,
      });
      const preference = new Preference(client);
      const payment = await createPayment({ order, preference, userName });
      if (payment?.sandbox_init_point) {
        return res.status(200).json({ payLink: payment?.sandbox_init_point });
      }
    } else {
      return res.status(400).json({ message: "Error" });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export const receiveWebhook = async (req, res) => {
  const payment = req.query;
  const { username } = req.params;
  // console.log(payment);
  console.log(username);
};
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

async function createPayment({ order, preference, userName }) {
  try {
    const paymentRequest = await preference.create({
      body: {
        items: order.map(
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
              metadata: {
                prodId,
                prodName,
                prodPrice,
                prodGender,
              },
            };
          }
        ),
        back_urls: {
          success: "http://localhost:8090/api/users/success",
          failure: "http://localhost:8090/api/users/failure",
          pending: "http://localhost:8090/api/users/pending",
        },
        notification_url: `http://localhost:8090/api/users/webhook/${userName}`,
      },
    });
    return paymentRequest;
  } catch (error) {
    console.log(error);
  }
}

export const success = async (req, res) => {
  console.log("success!");
};
export const failure = (req, res) => {
  console.log("Failure!");
};
export const pending = (req, res) => {
  console.log("Pending..");
};

//Cuentas de prueba

//COMPRADOR
//User: TEST44562
//Pass: Of9seevw8u

//VENDEDOR
//User: TETEE11591
//Pass: NEUqO9Riik
