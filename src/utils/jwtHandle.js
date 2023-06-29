import jsonwebtoken from "jsonwebtoken";
const { sign, verify } = jsonwebtoken;
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET;

const generateToken = (login_username) => {
  const jwt = sign({ login_username }, JWT_SECRET, { expiresIn: "2h" });
  return jwt;
};
const refreshToken = (login_username) => {
  const freshJWT = sign({ login_username }, REFRESH_JWT_SECRET, {
    expiresIn: "1d",
  });
  return freshJWT;
};

const verifyToken = (jwt) => {
  const isVerified = verify(jwt, JWT_SECRET);
  return isVerified;
};

export { generateToken, refreshToken, verifyToken };
