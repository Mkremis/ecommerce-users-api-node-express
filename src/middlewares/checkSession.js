import { verifyToken } from "../utils/jwtHandle";

const checkSession = (req, res, next) => {
  try {
    const jwtByUser = req.headers.authorization || '';
    const jwt = jwtByUser.split(' ').pop(); //['Bearer','11111']
    const isUser = verifyToken(`${jwt}`);
    console.log('isUser', isUser);
    if (!isUser) {
      res.status(401);
      res.send('NO_TIENES_UNA_SESSION_VALIDA');
    } else {
      req.user = isUser;
      next();
    }
  } catch (e) {
    res.status(400);
    console.log(e);
    res.send('SESSION_NO_VALIDA');
  }
};
export { checkSession };
