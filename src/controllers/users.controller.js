import { pool } from "../db.js";

//GET ALL USERS
export const getUsers = async (req, res) => {
  try {
    const results = await pool.query(`SELECT * FROM users`);
    res.json(results[0]);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
//GET ONE USER
export const getUser = async (req, res) => {
  const { username } = req.params;

  try {
    const [rows] = await pool.query(`SELECT * FROM users WHERE login_username = ?`, [
      username,
    ]);
    if (rows.length <= 0)
      return res.status(404).json({ message: "user not found" });
    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
//POST ONE USER
export const createUser = async (req, res) => {
  // obtiene los datos del usuario desde el cuerpo de la solicitud
  let userData = req.body;

  try {
    // inserta el usuario en la tabla users
    const [rows] = await pool.query("INSERT INTO users (login_password, login_username, fullname_first, fullname_last, contact_email, contact_phone, picture_thumbnail, fullname_title, location_city, location_state, location_number, location_street, location_country, location_postcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [userData.login_username, userData.login_password, userData.fullname_first, userData.fullname_last, userData.contact_email, userData.contact_phone, userData.picture_thumbnail, userData.fullname_title, userData.location_city, userData.location_state, userData.location_number, userData.location_street, userData.location_country, userData.location_postcode]);

    res.send({ message: "user added successfully" });
  } catch (error) {
    return res.status(500).json({ message: error, data: userData });
  }
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
