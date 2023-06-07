import { pool } from "../db.js";

export const cartUpdate = async ({username, cart})=>{
    try {
        const [result] = await pool.query(
          "UPDATE users SET user_cart = ? WHERE login_username = ?",
          [cart, username]
        );
        if (result.affectedRows === 0)
          return res.status(404).json({ message: "user not found" });
        res.json({ message: result.info });
      } catch (error) {
        return res.status(500).json({ message: error });
      }
};

