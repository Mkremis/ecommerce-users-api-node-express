import mercadopago from "mercadopago";
import { MERCADOPAGO_API_KEY } from "../config.js";
import { cartUpdate } from "../services/cart.js";
import { registerSale } from "../services/sales.js";

export const createOrder = async (req, res) => {
  const username = req.user.login_username;
  const order = req.body;
  let cartItems = [];
  for (const key in order) {
    let obj = {};
    if (parseInt(order[key]["productQ"]) > 0) {
      obj.id = key;
      obj.category_id = order[key]["gender"];
      obj.picture_url = `https://${order[key]["prodImage"]}`;
      obj.title = order[key]["prodName"];
      obj.quantity = parseInt(order[key]["productQ"]);
      obj.currency_id = "USD";
      obj.unit_price = parseFloat(order[key]["prodPrice"]);
      cartItems.push(obj);
    }
  }

  mercadopago.configure({
    access_token: MERCADOPAGO_API_KEY,
  });
  try {
    const result = await mercadopago.preferences.create({
      items: cartItems,
      back_urls: {
        success: `https://mkremis.github.io/ecommerce-react/#/success-payment`,
        pending:
          "https://ecommerce-users-api-production.up.railway.app/api/pending",
        failure:
          "https://ecommerce-users-api-production.up.railway.app/api/failure",
      },
      notification_url: `https://ecommerce-users-api-production.up.railway.app/api/webhook/${username}`,
    });
    res.json(result.body);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const receiveWebhook = async (req, res) => {
  const payment = req.query;
  try {
    if (payment.type === "payment") {
      const data = await mercadopago.payment.findById(payment["data.id"]);
      const { username } = req.params;
      // console.log(
      //   "items",
      //   data.body.additional_info.items,
      //   "date",
      //   data.body.date_approved,
      //   "fee",
      //   data.body.fee_details.fee[0].type,
      //   "webhook username",
      //   username
      // );

      registerSale(
        data.body.additional_info.items,
        username,
        data.body.date_approved,
        data.body.fee_details.fee[0].type
      );
      const cart = null;
      const response = await cartUpdate({ username, cart });

      if (response.success) {
        // res.status(204).json({ data });
        // console.log("response cartUpdate", response);
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const success = async (req, res) => {
  res.send("success!");
};
export const failure = (req, res) => {
  res.send("Failure!");
};
export const pending = (req, res) => {
  res.send("Pending..");
};
