import { pool } from "../db.js";

export const cartUpdate = async ({username, cart})=>{
    try {
        const [rows] = await pool.query(
          "UPDATE users SET user_cart = ? WHERE login_username = ?",
          [cart, username]
        );
        if (rows.affectedRows) return { success: rows };
    } catch (error) {
      return { fail: error };
    }
};

