import jsonwebtoken from "jsonwebtoken";
const { sign, verify } = jsonwebtoken;
const JWT_SECRET = process.env.JWT_SECRET || "token.01010101";

const generateToken = (login_username) => {
  const jwt = sign({ login_username }, JWT_SECRET, { expiresIn: "2h" });
  return jwt;
};

const verifyToken = (jwt) => {
  const isVerified = verify(jwt, JWT_SECRET);
  return isVerified;
};

export { generateToken, verifyToken };
