import {
  getData,
  loginUser,
  registerNewUser,
  updateUserData,
} from "../services/auth.services.js";

//Dashboard
export const getUserData = async (req, res) => {
  console.log("cookies", req.cookies)
  try {
    const { username } = req.params;
    const responseData = await getData({ username });
    if (responseData.success) return res.status(200).json(responseData.success);
    return res.status(404).json(responseData.fail);
  } catch (error) {
    res.status(500).json(error);
  }
};

//Login
export const login = async (req, res) => { 
  try {
    const { body } = req;
    const { login_username, login_password } = body;
    const { passwordHash } = req;
    const responseUser = await loginUser({
      login_username,
      login_password,
      passwordHash,
    });
    if (responseUser === "INCORRECT_PASSWORD") {
      res.status(403).json({ message: responseUser });
    } else {
      res.cookie('accessToken', responseUser?.accessToken, {
        httpOnly: true,
        secure: false,  //changes secure
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000,
      });
      const {accessToken, userData} = responseUser
      res.status(200).json({accessToken ,userData});
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

//register
export const register = async (req, res) => {
  try {
    if (req.passwordHash)
      return res.status(409).json({ message: "ALREADY_USER" });
    let userData = req.body;
    const responseRegister = await registerNewUser({ userData });
    if (responseRegister.success)
      return res.status(200).json(responseRegister.success);
    return res.status(409).json(responseRegister.fail);
  } catch (error) {
    res.status(500).json({ error });
  }
};

//UPDATE USER
export const updateUser = async (req, res) => {
  try {
    let userData = req.body;
    const responseUpdate = await updateUserData({ userData });
    if (responseUpdate.success)
      return res.status(200).json(responseUpdate.success);
    return res.status(500).json(responseUpdate.fail);
  } catch (error) {
    res.status(500).json({ error });
  }
};
