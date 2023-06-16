import {
  getData,
  loginUser,
  registerNewUser,
  updateUserData,
} from "../services/auth.services.js";

//Dashboard
export const getUserData = async (req, res) => {
  try {
    const { username } = req.params;
    const responseData = await getData({ username });
    if (responseData.success) return res.status(200).json(responseData.success);
    return res.status(404).json(responseData.error);
  } catch (error) {
    console.log(error);
  }
};

//Login
export const login = async (req, res) => {
  if (!req.passwordHash)
    return res.status(404).json({ message: "NOT_FOUND_USER" });
  const { body } = req;
  const { login_username, login_password } = body;
  const { passwordHash } = req;
  const responseUser = await loginUser({
    login_username,
    login_password,
    passwordHash,
  });
  if (responseUser === "INCORRECT_PASSWORD") {
    res.status(403);
    res.json({ message: responseUser });
  } else {
    res.json(responseUser);
  }
};

//register
export const register = async (req, res) => {
  try {
    if (req.passwordHash) throw new Error({ message: "ALREADY_USER" });
    let userData = req.body;
    const responseRegister = await registerNewUser({ userData });
    if (responseRegister.success)
      return res.status(200).json(responseRegister.success);
  } catch (error) {
    return res.status(500).json(error);
  }
};

//UPDATE USER
export const updateUser = async (req, res) => {
  try {
    let userData = req.body;
    const responseUpdate = await updateUserData({ userData });
    if (responseUpdate.success)
      return res.status(200).json(responseUpdate.success);
  } catch (error) {
    return res.status(500).json(error);
  }
};
