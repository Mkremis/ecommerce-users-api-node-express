import { pool } from "../db.js";
const registerNewUser = async ( username) => {
    const checkIs = await pool.query(`SELECT * FROM users WHERE username = ?`, [
        username,
      ]);;
    if (checkIs)   return res.status(500).json({ message: 'ALREADY_USER' });
    // const passHash = encrypt(password);
    // const registerNewUser = await UserModel.create({
    //   username,
    //   password: passHash,
    //   email,
    // });
    return registerNewUser;
  };
export {registerNewUser}