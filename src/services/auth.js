import { pool } from "../db.js";
const registerNewUser = async ( username) => {
    const [rows] = await pool.query(`SELECT * FROM users WHERE username = ?`, [
        username,
      ]);;
    if (rows.length > 0) return res.status(404).json({ message: 'ALREADY_USER' });
    // const passHash = encrypt(password);
    // const registerNewUser = await UserModel.create({
    //   username,
    //   password: passHash,
    //   email,
    // });
    return registerNewUser;
  };
export {registerNewUser}