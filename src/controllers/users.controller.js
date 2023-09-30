import PostgreSQLAdapter from "../adapters/postgres.js";
import { encrypt, verify } from "../utils/bcryptHandle.js";
import { accessJWT } from "../utils/jwtHandle.js";

const db = new PostgreSQLAdapter();

export const dashboard = async (req, res) => {
  try {
    const { username } = req.user;
    const responseData = await db.getUserByUsername({ username });
    if (responseData.success) return res.status(200).json(responseData.success);
    return res.status(404).json({ message: responseData.fail });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { login_username, login_password } = req.body;
    if (!req.passwordHash) {
      return res.status(401).json({ message: ["Not user found"] });
    }
    const { passwordHash } = req;
    const isCorrect = await verify(login_password, passwordHash);
    if (!isCorrect) {
      return res.status(401).json({ message: ["Incorrect credentials"] });
    }
    const accessToken = accessJWT(login_username);
    const userData = await db.getLoginData(login_username);
    res.cookie("accessToken", accessToken, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({ userData });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error });
  }
};

export const register = async (req, res) => {
  try {
    if (req.passwordHash) {
      return res
        .status(409)
        .json({ message: ["Already user with this username"] });
    }
    let userData = req.body;
    userData.login_password = await encrypt(userData.login_password);
    const response = await db.registerNewUser({ userData });
    if (response.success) {
      return res.status(200).json({ message: [response.success] });
    }
    return res.status(409).json({ message: [response.fail] });
  } catch (error) {
    res.status(500).json({ message: [error.message] });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userData = req.body;
    if (userData.login_password) {
      userData.login_password = await encrypt(userData.login_password);
    }
    const response = await db.updateUserData({ userData });
    if (response.success) {
      return res.status(200).json({ message: [response.success] });
    }
    return res.status(500).json({ message: [response.fail] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: [error.message] });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("accessToken", { httpOnly: true });
  res.status(200).json({ message: "User logged out successfully" });
};

export const reloadSession = async (req, res) => {
  try {
    const { username } = req.user;
    const userData = await db.getLoginData(username);
    res.status(200).json({ userData });
  } catch (error) {
    res.status(500).json({ error });
  }
};
