import { pool } from "../db.js";

export const ping = async (req, res) => {
  const [result] = await pool.query("SELECT 'pong' AS result");
  res.json(result[0]);
};

export const tables = async (req, res) => {
  const [result] = await pool.query("SHOW TABLES");
  res.json(result[0]);
};

export const db = async (req, res) => {
  const { db } = req.params;
  const [result] = await pool.query(`DESCRIBE ${db}`);
  res.json(result);
};
