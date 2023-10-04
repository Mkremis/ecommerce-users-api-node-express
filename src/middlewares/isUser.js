// isUser.js
import db from "../database.js";

const isUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new Error("username and password are required");
    }

    const response = await db.getUserByUsername({ username: username });
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
