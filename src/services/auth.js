import { pool } from "../db.js";
const registerNewUser = async ( username) => {
try {
    const [rows] = await pool.query(`SELECT * FROM users WHERE username = ?`, [
        username,
      ]);
   if (rows.length > 0) {
    throw new Error('ALREADY_USER')
}else{
    return
}
    // const passHash = encrypt(password);
    // const registerNewUser = await UserModel.create({
    //   username,
    //   password: passHash,
    //   email,
    // });
    // return registerNewUser;
} catch (error) {
    return res.status(500).json({ message: error });
}
  };
export {registerNewUser}