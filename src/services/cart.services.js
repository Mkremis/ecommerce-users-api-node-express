import { pool } from "../db.js";

export const cartUpdate = async ({ username, cart }) => {
  let updatedCart = cart ? JSON.stringify(cart) : null;
  console.log("cartUpdate", updatedCart);
  try {
    const [rows] = await pool.query(
      "UPDATE users SET user_cart = ? WHERE login_username = ?",
      [updatedCart, username]
    );
    if (rows.affectedRows) return { success: rows };
  } catch (error) {
    return { fail: error };
  }
};

export const getUserCart = async ({ username }) => {
  try {
    const [rows] = await pool.query(
      `SELECT user_cart FROM users WHERE login_username = ?`,
      username
    );
    return { success: rows[0] };
  } catch (error) {
    return { fail: error };
  }
};
