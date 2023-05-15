import { pool } from "../db.js";
import { registerNewUser } from "../services/auth.js";
//GET ALL USERS
//GET ONE USER
export const getUsers = async (req, res) => {
  try {
    const results = await pool.query(`SELECT * FROM users`);
    res.json(results[0]);
  } catch (error) {
    return res.status(500).json({ message: "something goes wrong" });
  }
};
//GET ONE USER
export const getUser = async (req, res) => {
  const { username } = req.params;

  try {
    const [rows] = await pool.query(`SELECT * FROM users WHERE username = ?`, [
      username,
    ]);
    if (rows.length <= 0)
      return res.status(404).json({ message: "user not found" });
    res.json(rows[0]);
    console.log(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
//POST ONE USER
export const createUser = async (req, res) => {
  // obtiene el nombre del usuario desde el parámetro de consulta
  const { username } = req.params;

  // obtiene los datos del usuario desde el cuerpo de la solicitud
  const userData = req.body;
registerNewUser(username)
  // crea un objeto con el nombre y los datos del usuario
  // const user = { username, userData: JSON.stringify(userData) };
  // try {
  //   // inserta el usuario en la tabla users
  //   const [rows] = await pool.query("INSERT INTO users SET ?", user);
  //   res.send({ message: "user added successfully" });
  // } catch (error) {
  //   return res.status(500).json({ message: error });
  // }
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
