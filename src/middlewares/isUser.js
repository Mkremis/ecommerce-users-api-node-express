import { pool } from "../db.js";

const isUser = async (req, res, next) => {
  const { body } = req;
  const { login_username } = body;

  let [rows] = await pool.query(
    `SELECT * FROM users WHERE login_username = ?`,
    [login_username]
  );
  if (rows.length > 0) {
    req.isUser = true;
  } else {
    req.isUser = false;
  }
  next();
};
export { isUser };
