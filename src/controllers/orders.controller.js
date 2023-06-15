import { getOrders } from "../services/orders.services.js";

export const getUserOrders = async (req, res) => {
  try {
    const { username } = req.params;
    const responseData = await getOrders({ username });
    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ error });
  }
};
