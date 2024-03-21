import { verifyToken } from "../utils/jwtHandle.js";

const checkSession = async (req, res, next) => {
  try {
    const { jwt } = req.cookies;
    if (!jwt) {
      return res
        .status(401)
        .json({ message: ["You do not have a valid session"] });
    }
    const isSession = verifyToken({ jwt });

    if (isSession.success) {
      req.user = { id: isSession.success.user_id };
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
