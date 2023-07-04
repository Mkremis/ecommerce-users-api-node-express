import jsonwebtoken from "jsonwebtoken";
const { sign, verify } = jsonwebtoken;
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET 
const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET;

const accessJWT =  (username) => {
  const accessToken = sign({username}, process.env.JWT_SECRET,{ expiresIn: '5m' });
  return accessToken;
};
const refreshJWT = (username) => {
  const freshJWT = sign({username}, REFRESH_JWT_SECRET, { expiresIn: '1d' });
  return freshJWT;
};

const verifyToken = (jwt) => {
  const isVerified = verify(jwt, JWT_SECRET);
  return isVerified;
};

const verifyRefreshToken = (refreshToken)=>{
  const result = verify(refreshToken, REFRESH_JWT_SECRET, (err, decoded) => {
    if (err) {
      // El token de actualización no es válido
      return {fail: err};
    }
    // El token de actualización es válido, generar un nuevo token de acceso
    const newAccessToken = sign(
      { username : decoded.username },
      JWT_SECRET,
      { expiresIn: '15m'}
    );
   return {success: {newAccessToken, username: decoded.username}};
  });
  return result
}
export { accessJWT, refreshJWT , verifyToken, verifyRefreshToken };
 