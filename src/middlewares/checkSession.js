import { verifyToken } from '../utils/jwtHandle.js';

const checkSession = async (req, res, next) => {
  const { accessToken } = req.cookies;
  console.log('cookies', req.cookies);
  if (!accessToken) return res.send(false);
  const isUser = verifyToken(accessToken);
  if (isUser.success) {
    req.user = isUser.success;
    console.log(isUser.success);
    next();
  } else {
    res.status(401).json({ message: 'NO_TIENES_UNA_SESSION_VALIDA' });
  }
};

export { checkSession };
