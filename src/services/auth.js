import { pool } from "../db.js";
const registerNewUser = async (username, userData) => {
try {
    const [rows] = await pool.query(`SELECT * FROM users WHERE username = ?`, [
        username,
      ]);
   if (rows.length > 0) {
    throw new Error('ALREADY_USER')
}else{
     // crea un objeto con el nombre y los datos del usuario
  const user = { username, userData: JSON.stringify(userData) };
  const [rows] = await pool.query("INSERT INTO users SET ?", user);
   res.send({ message: "user added successfully" });
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