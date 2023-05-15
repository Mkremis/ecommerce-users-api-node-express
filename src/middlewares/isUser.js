import { pool } from "../db.js";
import bcrypt from "bcryptjs";

const isUser = async (req, res, next) => {

       // obtiene el nombre del usuario desde el parámetro de consulta
  const { username } = req.params;

    let [rows] = await pool.query(`SELECT * FROM users WHERE username = ?`, [
        username,
      ]);
   if (rows.length > 0) {
    return res.status(404).json({ message: "ALREADY_USER" });
}else{
  var hash = bcrypt.hashSync('bacon', 8);
  req.locals.hashpass = hash;
    next();
}
  };
export {isUser}