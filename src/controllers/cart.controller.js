import { pool } from "../db.js";

//GET CART
export const getCart = async (req, res) => {
  const { username } = req.params;
  try {
    const [rows] = await pool.query(`SELECT user_cart FROM cart WHERE login_username = ?`, [
      username,
    ]);
    res.json({message:rows[0]});
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

//CREATE AND UPDATE CART
export const updateCart = async (req, res) => {
  const { username } = req.params;
  const cart = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO cart (login_username, user_cart) VALUES (?,?)",
      [username, cart]
    );
    res.json({ message: result });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
