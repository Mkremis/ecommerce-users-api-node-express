// isUser.js
import db from "../database.js";

const isUser = async (req, res, next) => {
  try {
    const { login_username, login_password } = req.body;

    if (!login_username || !login_password) {
      throw new Error("username and password are required");
    }

    const response = await db.getUserByUsername(login_username);
    console.log(response);
    if (response.success) {
      req.passwordHash = response.success.user.login_password;
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: [error.message] });
  }
};

export { isUser };
