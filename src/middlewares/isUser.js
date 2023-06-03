import { pool } from "../db.js";

const isUser = async (req, res, next) => {
  const { body } = req;
  const { username, password } = body;

  let [rows] = await pool.query(`SELECT * FROM users WHERE username = ?`, [
    username,
  ]);
  if (rows.length > 0) {
    return res.status(404).json({ message: "ALREADY_USER" });
  } else {
    next();
  }
};
export { isUser };
