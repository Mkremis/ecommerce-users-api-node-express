import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import dotenv from "dotenv";

dotenv.config();

export const handleRefreshToken = async (req, res) => {
  const { username } = req.params;
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: cookies });
  const refreshToken = cookies.jwt;

  let [rows] = await pool.query(
    `SELECT refresh_token FROM users WHERE login_username = ?`,
    [username]
  );
  console.log("rows", rows);
  if (rows.length === 0) return res.sendStatus(403); //forbidden
  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || username !== decoded.username) return res.sendStatus(403);
    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.json({ accessToken });
  });
};
