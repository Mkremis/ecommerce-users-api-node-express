import { pool } from "../db.js";
import { cartUpdate } from "../services/cart.js";

//GET CART
export const getCart = async (req, res) => {
  const { username } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT user_cart FROM users WHERE username = ?`,
      [username]
    );
    res.json({ message: rows[0] });
  } catch (error) {
    return res.status(500).json({ message: error });
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
