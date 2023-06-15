import { pool } from "../db.js";
export const pong = async () => {
  try {
    const [result] = await pool.query("SELECT 'pong' AS result");
    return result;
  } catch (error) {
    return error;
  }
};

export const showTables = async () => {
  try {
    const [result] = await pool.query("SHOW TABLES");
    return result;
  } catch (error) {
    return error;
  }
};

export const describeDB = async (db) => {
  try {
    const [result] = await pool.query(`DESCRIBE ${db}`);
    return result;
  } catch (error) {
    return error;
  }
};
