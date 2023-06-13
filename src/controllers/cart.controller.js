import { cartUpdate, getUserCart } from "../services/cart.js";

//GET CART
export const getCart = async (req, res) => {
  const { username } = req.params;
  try {
    const response = await getUserCart({ username });
    res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

//PUT CART
export const updateCart = async (req, res) => {
  const { username } = req.params;
  const cart = JSON.stringify(req.body);
  try {
    const response = await cartUpdate({ username, cart });
    res.status(200).json({ response });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
