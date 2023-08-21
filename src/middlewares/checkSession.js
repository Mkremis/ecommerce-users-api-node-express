import { verifyToken } from '../utils/jwtHandle.js';

const checkSession = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;
    console.log(accessToken);
    if (!accessToken) {
      return res.status(401).json({ message: 'NO_TIENES_UNA_SESSION_VALIDA' });
    }
    const isUser = verifyToken(accessToken);
    if (isUser.success) {
      req.user = isUser.success;
      next();
    } else {
      return res.status(401).json({ message: 'NO_TIENES_UNA_SESSION_VALIDA' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { checkSession };
