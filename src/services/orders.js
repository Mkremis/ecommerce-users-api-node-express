import { pool } from "../db.js";

export const getOrders = async ({ username }) => {
  const [rows] = await pool.query(
    `SELECT * FROM sales WHERE login_username = ?`,
    username
  );
  const data = { user: rows[0] };
  return data;
};
