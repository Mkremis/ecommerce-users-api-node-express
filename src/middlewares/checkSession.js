import { verifyToken } from "../utils/jwtHandle.js";

const checkSession = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      return res
        .status(401)
        .json({ message: ["You do not have a valid session"] });
    }
    const isUser = verifyToken(accessToken);
    if (isUser.success) {
      req.user = isUser.success;
      next();
    } else {
      return res
        .status(401)
        .json({ message: ["You do not have a valid session"] });
    }
  } catch (error) {
    res.status(500).json({ message: [error.message] });
  }
};

export { checkSession };
