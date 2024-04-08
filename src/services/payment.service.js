import { MercadoPagoConfig, Preference } from "mercadopago";
import { ENDPOINT, MERCADOPAGO_API_KEY } from "../config.js";

const client = new MercadoPagoConfig({
  accessToken: MERCADOPAGO_API_KEY,
});

export const mercadopagoService = async ({
  userId,
  userName,
  email,
  items,
}) => {
  try {
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        back_urls: {
          success: `https://mkremis.github.io/ecommerce-react/#/success-payment`,
          failure: `https://mkremis.github.io/ecommerce-react/#/fail-payment`,
          pending: `https://mkremis.github.io/ecommerce-react/#/pending-payment`,
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
    });

    return result.id;
  } catch (error) {
    console.error("Error creating preference:", error);
    throw new Error(("Error creating preference:", error));
  }
};
