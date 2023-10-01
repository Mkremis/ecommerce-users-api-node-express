// isUser.js
import db from "../database.js";

const isUser = async (req, res, next) => {
  try {
    const { login_username, login_password } = req.body;

    if (!login_username || !login_password) {
      throw new Error("username and password are required");
    }

    const response = await db.getUserByUsername({ username: login_username });
    if (response.success) {
      req.user_data = response.success;
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: [error.message] });
  }
};

export { isUser };
