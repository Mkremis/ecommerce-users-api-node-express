import { loginService, registerService } from "../services/auth.services.js";

/**
 * Controller for user login.
 * @param {Request} req - HTTP request object.
 * @param {Response} res - HTTP response object.
 * @returns {Response} HTTP response with login result.
 */
export const loginController = async (req, res) => {
  try {
    const loginData = req.body;
    const isUser = req?.user;

    const loginResult = await loginService({ isUser, loginData });

    if (loginResult.fail?.isUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (loginResult.fail?.credentials) {
      return res.status(401).json({ error: "Incorrect credentials" });
    }

    if (loginResult.success) {
      res.cookie("jwt", loginResult.success.jwt, {
        httpOnly: process.env.NODE_ENV !== "development",
        secure: true,
        sameSite: "none",
      });
      return res.status(200).json(loginResult.success.login);
    }

    return res.status(500).json({ error: "Login error" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Controller for user registration.
 * @param {Request} req - HTTP request object.
 * @param {Response} res - HTTP response object.
 * @returns {Response} HTTP response with registration result.
 */
export const registerController = async (req, res) => {
  try {
    let isUser = req?.user?.id;
    let registerData = req.body;

    const registerResult = await registerService({ isUser, registerData });

    if (registerResult.success) {
      return res.sendStatus(204);
    }

    if (registerResult.fail?.alreadyUser) {
      return res
        .status(403)
        .json({ error: "Forbidden: User is already registered" });
    }

    return res.status(500).json({ error: "Registration error" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
