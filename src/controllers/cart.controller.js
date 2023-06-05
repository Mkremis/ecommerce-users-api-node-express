import { pool } from "../db.js";

//GET CART
export const getCart = async (req, res) => {
  const { username } = req.params;
  try {
    const [rows] = await pool.query(`SELECT user_cart FROM cart WHERE login_username = ?`, [
      username,
    ]);
    // if (rows.length = 0)
    //   return res.status(404).json({ message: "user not found" });
    res.json(rows[0]);
    console.log(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

//PUT CART
export const updateCart = async (req, res) => {
  // obtiene el nombre del usuario desde el parámetro de consulta
  const { username } = req.params;
  // obtiene el cart del usuario desde el cuerpo de la solicitud
  const cart = JSON.stringify(req.body);
  // crea un objeto con el nombre y el cart del usuario

  try {
    const [result] = await pool.query(
      "UPDATE users SET cart = ? WHERE username = ?",
      [cart, username]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "user not found" });
    res.json({ message: result.info });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
