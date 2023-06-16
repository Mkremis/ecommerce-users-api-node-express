import { verifyToken } from "../utils/jwtHandle.js";

const checkSession = (req, res, next) => {
  try {
    const jwtByUser = req.headers.authorization || "";
    const jwt = jwtByUser.split(" ").pop(); //['Bearer','11111']
    const isUser = verifyToken(`${jwt}`);
    if (!isUser) {
      res.status(401);
      res.send("NO_TIENES_UNA_SESSION_VALIDA");
    } else {
      req.user = isUser;
      next();
    }
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};
export { checkSession };
