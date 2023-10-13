// isUser.js
import dbPromise from "../index.js";

const isUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new Error("username and password are required");
    }
    const db = await dbPromise;
    const response = await db.getUserByUsername({ username: username });
    if (response.success) {
      req.user = {
        id: response.success.id,
        password: response.success.password,
      };
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: [error.message] });
  }
};

export { isUser };
