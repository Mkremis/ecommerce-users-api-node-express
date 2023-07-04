import { getRefreshToken } from "../services/auth.services.js";

export const handleRefreshToken = async (req, res) => {
  // const cookies = req.cookies;
  // if (!cookies?.accessToken) return res.sendStatus(401);
  // const refreshToken = cookies.accessToken;
  const {refreshToken} = req.body;
  const isRefreshToken = await getRefreshToken(isUser.username)
  if(!refreshToken || !isRefreshToken ) res.sendStatus(401)
  console.log('refreshtoken', isRefreshToken)
  res.json({refreshToken}) 

  // Verificar y decodificar el token de actualización
  // jsonwebtoken.verify(refreshToken, REFRESH_JWT_SECRET, (err, decoded) => {
  //   if (err) {
  //     // El token de actualización no es válido
  //     return res.sendStatus(403);
  //   }

  //   // El token de actualización es válido, generar un nuevo token de acceso
  //   const newAccessToken = jsonwebtoken.sign(
  //     { login_username: decoded.login_username },
  //     JWT_SECRET,
  //     { expiresIn: "15m" }
  //   );
  //   res.json({  newAccessToken });
  // });
};
