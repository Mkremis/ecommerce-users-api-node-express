import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET;

export const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.accessToken) return res.status(401).json({message:'hola'});
  const refreshToken = cookies.accessToken;

  // Verificar y decodificar el token de actualización
  jsonwebtoken.verify(refreshToken, REFRESH_JWT_SECRET, (err, decoded) => {
    if (err) {
      // El token de actualización no es válido
      return res.sendStatus(403);
    }

    // El token de actualización es válido, generar un nuevo token de acceso
    const newAccessToken = jsonwebtoken.sign(
      { login_username: decoded.login_username },
      JWT_SECRET,
      { expiresIn: "15m" }
    );
    res.json({  newAccessToken });
  });
};
