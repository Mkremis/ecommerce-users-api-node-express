import { pool } from "../db.js";

export const likesUpdate = async ({ username, likes }) => {
  try {
    const [rows] = await pool.query(
      "UPDATE users SET user_likes = ? WHERE login_username = ?",
      [likes, username]
    );
    if (rows.affectedRows) return { success: rows };
  } catch (error) {
    return { fail: error };
  }
};

export const getUserLikes = async ({ username }) => {
  try {
    const [rows] = await pool.query(
      `SELECT user_likes FROM users WHERE login_username = ?`,
      username
    );
    return { success: rows[0] };
  } catch (error) {
    return { fail: error };
  }
};
