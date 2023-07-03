import jsonwebtoken from "jsonwebtoken";
const { sign, verify } = jsonwebtoken;
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET;

const generateToken = (user) => {
  const jwt = sign(user, JWT_SECRET, { expiresIn: "15m" });
  return jwt;
};
const generateRefreshToken = (user) => {
  const freshJWT = sign(user, REFRESH_JWT_SECRET);
  return freshJWT;
};

const verifyToken = (jwt) => {
  const isVerified = verify(jwt, JWT_SECRET);
  return isVerified;
};

export { generateToken, generateRefreshToken, verifyToken };
