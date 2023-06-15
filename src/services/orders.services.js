import { pool } from "../db.js";

export const getOrders = async ({ username }) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM sales WHERE login_username = ?`,
      username
    );
    const data = { orders: rows };
    return data;
  } catch (error) {
    return { fail: error };
  }
};
