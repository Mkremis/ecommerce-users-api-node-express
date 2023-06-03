import { pool } from "../db.js";

const loginUser = async ({ username, password }) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM users WHERE login_username=?`,
      username
    );
    if (rows.length <= 0) return "NOT_FOUND_USER";
    return "USER_FOUND";
  } catch (error) {
    return res.status(500).json({ message: error });
  }
  // const passwordHash = checkIs.password; //password encriptado
  // const isCorrect = await verified(password, passwordHash);
  // if (!isCorrect) return "INCORRECT_PASSWORD";
  // const token = generateToken(checkIs.username);
  // const data = {
  //   token,
  //   user: checkIs,
  // };
  // return data;
};
export { loginUser };
