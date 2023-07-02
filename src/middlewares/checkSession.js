import { verifyToken } from "../utils/jwtHandle.js";

const checkSession = (req, res, next) => {
  res.send(req.cookies)
  return
  try {
    const jwtByUser = req.headers.authorization || "";
    const jwt = jwtByUser.split(" ").pop(); //['Bearer','11111']
    const isUser = verifyToken(`${jwt}`);
    if (isUser) {
      req.user = isUser;
      next();
    }
  } catch (error) {
    res.status(401);
    res.json({ message: "NO_TIENES_UNA_SESSION_VALIDA" });
  }
};
export { checkSession };
