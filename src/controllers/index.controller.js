import { pool } from "../db.js";

export const ping = async (req, res) => {
  const [result] = await pool.query("SELECT 'pong' AS result");
  res.json(result[0]);
};

export const tables = async (req, res) => {
  const [result] = await pool.query("SHOW TABLES");
  res.json(result[0]);
};

export const users = async (req, res) => {
  const [result] = await pool.query("DESCRIBE users");
  res.json(result);
};
