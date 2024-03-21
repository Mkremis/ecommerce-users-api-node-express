import dbPromise from "../index.js";
import { encrypt } from "../utils/bcryptHandle.js";

export const dashboard = async (req, res) => {
  const db = await dbPromise;
  try {
    const responseData = await db.getUserById({ id: req.user.id });
    if (responseData.success) {
      const user_data = responseData.success;
      // Excluir propiedades no deseadas
      delete user_data?.password;
      delete user_data?._id;
      delete user_data?.id;

      return res.status(200).json(user_data);
    }
    return res.status(404).json({ message: responseData.fail });
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
    const { id } = req.user;
    const { success: user_data } = await db.getUserById({ id });
    const { success: likes } = await db.getUserLikes({ id });
    const { success: user_cart } = await db.getUserCart({ id });

    // Excluir propiedades no deseadas
    delete user_data?.password;
    delete user_data?._id;
    delete user_data?.id;

    res.status(200).json({
      user_data: user_data,
      ...user_cart,
      user_likes: { likes: likes },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
