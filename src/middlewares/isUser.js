import { pool } from "../db.js";
import {genSaltSync, hashSync} from 'bcryptjs';

const isUser = async (req, res, next) => {

       // obtiene el nombre del usuario desde el parámetro de consulta
  const { username } = req.params;

    let [rows] = await pool.query(`SELECT * FROM users WHERE username = ?`, [
        username,
      ]);
   if (rows.length > 0) {
    return res.status(404).json({ message: "ALREADY_USER" });
}else{
  var salt = genSaltSync(10);
  var hash = hashSync("B4c0/\/", salt);
  
    next()
}
  };
export {isUser}