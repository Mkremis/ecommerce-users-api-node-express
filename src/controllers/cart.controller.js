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

//PUT CART
export const updateCart = async (req, res) => {
  const { username } = req.params;
  const cart = req.body;
  // UPDATE cart SET user_cart = '{}' WHERE login_username = 'elvyspresley';
  try {
    const [result] = await pool.query(
      "UPDATE cart SET user_cart = ? WHERE login_username = ?",
      [cart, username]
    );
    res.json({ message: result.info });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
