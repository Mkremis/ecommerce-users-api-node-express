import dbPromise from "../index.js";
import { encrypt, verify } from "../utils/bcryptHandle.js";
import { accessJWT } from "../utils/jwtHandle.js";

export const dashboard = async (req, res) => {
  const db = await dbPromise;
  try {
    const responseData = await db.getUserById({ id: req.user.id });
    if (responseData.success) return res.status(200).json(responseData.success);
    return res.status(404).json({ message: responseData.fail });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!req?.user?.id)
      return res
        .status(404)
        .json({ message: [`Not user found with username ${username}`] });

    const passwordHash = req.user.password;
    const isCorrect = await verify(password, passwordHash);
    if (!isCorrect) {
      return res.status(401).json({ message: ["Incorrect credentials"] });
    }
    const { id } = req.user;
    const accessToken = accessJWT({ id });
    res.cookie("accessToken", accessToken, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: true,
      sameSite: "none",
    });
    const db = await dbPromise;
    const { success: user_data } = await db.getUserById({ id });
    const { success: likes } = await db.getUserLikes({ username, id });
    const { success: user_cart } = await db.getUserCart({ username, id });

    delete user_data.password;
    delete user_data.id;

    res
      .status(200)
      .json({ user_data, ...user_cart, user_likes: { likes: likes } });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error });
  }
};

export const register = async (req, res) => {
  try {
    if (req.user.id) {
      console.log(req.user.id);
      return res
        .status(409)
        .json({ message: ["Already user with this username"] });
    }
    let userData = req.body;
    userData.password = await encrypt(userData.password);
    const db = await dbPromise;
    const response = await db.registerNewUser({ userData });
    if (response.success) {
      return res.sendStatus(204);
    }
    return res.status(409).json({ message: [response.fail] });
  } catch (error) {
    res.status(500).json({ message: [error.message] });
  }
};

export const updateUser = async (req, res) => {
  const db = await dbPromise;

  try {
    const userData = req.body;
    if (userData.password) {
      userData.password = await encrypt(userData.password);
    }

    const response = await db.updateUserData({ userData, id: req.user.id });

    if (response.success) {
      return res.sendStatus(204);
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
  const db = await dbPromise;

  try {
    const { id } = req.user;
    console.log("id", id);
    const { success: user_data } = await db.getUserById({ id });
    const { success: user_likes } = await db.getUserLikes({
      username: null,
      id,
    });
    const { success: user_cart } = await db.getUserCart({ username: null, id });

    delete user_data.password;
    delete user_data.id;

    res.status(200).json({ user_data, ...user_cart, ...user_likes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
