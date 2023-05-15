import { pool } from "../db.js";
const isUser = async (req, res, next) => {

       // obtiene el nombre del usuario desde el parámetro de consulta
  const { username } = req.params;

    let [rows] = await pool.query(`SELECT * FROM users WHERE username = ?`, [
        username,
      ]);
   if (rows.length > 0) {
    return res.status(404).json({ message: "ALREADY_USER" });
}else{
     next()
}
    // const passHash = encrypt(password);
    // const registerNewUser = await UserModel.create({
    //   username,
    //   password: passHash,
    //   email,
    // });
    // return registerNewUser;

  };
export {isUser}