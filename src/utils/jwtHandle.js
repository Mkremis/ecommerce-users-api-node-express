import jsonwebtoken from 'jsonwebtoken';
const { sign, verify } = jsonwebtoken;
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const accessJWT = (username) => {
  const accessToken = sign({ username }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
  return accessToken;
};

const verifyToken = (jwt) => {
  const isVerified = verify(jwt, JWT_SECRET, (err, decoded) => {
    if (err) {
      return { fail: err };
    }
    return { success: { username: decoded.username } };
  });
  return isVerified;
};

export { accessJWT, verifyToken };
