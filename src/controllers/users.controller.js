import { pool } from "../db.js";
import { loginUser, registerNewUser } from "../services/auth.js";

//GET ALL USERS
export const getUsers = async (req, res) => {
  try {
    const results = await pool.query(`SELECT * FROM users`);
    res.json(results[0]);
  } catch (error) {
    return res.status(500).json({ message: error });
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
    res.json(responseUser, req.headers);
  }
};

//register
export const register = async (req, res) => {
  if (req.passwordHash)
    return res.status(404).json({ message: "ALREADY_USER" });
  // obtiene los datos del usuario desde el cuerpo de la solicitud
  let userData = req.body;
  const responseRegister = await registerNewUser({ userData });
  if (responseRegister.success)
    return res.status(200).send(responseRegister.success);
  return res.status(500).json(responseRegister.fail);
};

//PUT ONE USER
export const updateUser = async (req, res) => {
  // obtiene el nombre del usuario desde el parámetro de consulta
  const { username } = req.params;
  // obtiene los datos del usuario desde el cuerpo de la solicitud
  const userData = JSON.stringify(req.body);
  // crea un objeto con el nombre y los datos del usuario

  try {
    const [result] = await pool.query(
      "UPDATE users SET userData = ? WHERE username = ?",
      [userData, username]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "user not found" });
    res.json({ message: result.info });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
// DELETE ONE USER
export const deleteUser = async (req, res) => {
  const { username } = req.params;
  try {
    const [result] = await pool.query(`DELETE FROM users WHERE username = ?`, [
      username,
    ]);
    if (result.affectedRows <= 0)
      return res.status(404).json({ message: "user not found" });
    res.status(204).send(`user ${username} deleted successfully`);
  } catch (error) {
    return res.status(500).json({ message: "something goes wrong" });
  }
};
