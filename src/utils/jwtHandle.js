import jsonwebtoken from "jsonwebtoken";
const { sign, verify } = jsonwebtoken;
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const accessJWT = ({ id }) => {
  const accessToken = sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return accessToken;
};

const verifyToken = ({ accessToken }) => {
  const isVerified = verify(accessToken, JWT_SECRET, (err, decoded) => {
    if (err) {
      return { fail: err };
    }
    return { success: { user_id: decoded.id } };
  });
  return isVerified;
};

export { accessJWT, verifyToken };
