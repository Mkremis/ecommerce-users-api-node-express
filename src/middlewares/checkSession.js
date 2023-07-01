import { verifyToken, refreshToken } from "../utils/jwtHandle.js";

const checkSession = (req, res, next) => {
  // try {
  //   const { jwt } = req.cookies;
  //   // const jwtByUser = req.headers.authorization || "";
  //   // const jwt = jwtByUser.split(" ").pop(); //['Bearer','11111']
  //   const isUser = verifyToken(jwt);

  //   if (isUser) {
  //     req.user = isUser;
  //     res.json({ user: isUser, cookie: jwt });
  //     console.log(jwt, isUser);
  //     //     // El token de actualización es válido, generar un nuevo token de acceso
  //     // const freshToken = refreshToken()
  //     // res.json({ 'jwt': newAccessToken });
  //     next();
  //   } else {
  //     res.status(401).json({ message: "NO_TIENES_UNA_SESSION_VALIDA", isUser });
  //   }
  // } catch (error) {
  //   res.sendStatus(500);
  // }
  res.status(200).json({ req });
  next();
};
export { checkSession };
