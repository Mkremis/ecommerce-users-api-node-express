import { getOrders } from "../services/orders.js";

export const getUserOrders = async (req, res) => {
  const { username } = req.params;
  const responseData = await getOrders({ username });
  if (responseData) res.json(responseData);
};
