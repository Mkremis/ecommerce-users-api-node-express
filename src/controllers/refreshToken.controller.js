import jwt from 'jsonwebtoken'
import { pool } from "../db.js";
import dotenv from ('dotenv')

dotenv.config();

export const handleRefreshToken = (req, res) => {
  const {login_username} = req.params;
  const cookies = req.cookies;
  res.json(login_username, cookies)
  // if (!cookies?.jwt) return res.sendStatus(401);
  // const refreshToken = cookies.jwt;
  // let [rows] = await pool.query(
  //   `SELECT refresh_token FROM users WHERE login_username = ?`,
  //   [login_username]
  // );
 
  //  if (rows.length === 0) return res.sendStatus(403); //forbidden
  // // evaluate jwt
  // jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
  //   if (err || login_username !== decoded.username) return res.sendStatus(403);
  //   const accessToken = jwt.sign({username: decoded.username},
  //     process.env.ACCESS_TOKEN_SECRET,
  //     { expiresIn: '15m' }
  //   );
  //   res.json({ accessToken });
  // });
};

