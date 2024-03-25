import dbPromise from "../index.js";
import { encrypt } from "../utils/bcryptHandle.js";

export const dashboard = async (req, res) => {
  const db = await dbPromise;

  try {
    const response = await db.getUserDataById({ id: req.user.id });
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
  res.clearCookie("jwt", { httpOnly: true });
  res.status(200).json({ message: "User logged out successfully" });
};

export const reloadSession = async (req, res) => {
  const db = await dbPromise;
  try {
    const { id, email, userName } = req.user;
    const profilePicture = await db.getUserProfilePictureById({ id });
    const userData = { userName, email, thumbnail: profilePicture?.thumbnail };
    const userLikes = await db.getLikesByUserId({ id });
    const userCart = await db.getCartByUserId({ id });
    res.status(200).json({ userData, userLikes, userCart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
