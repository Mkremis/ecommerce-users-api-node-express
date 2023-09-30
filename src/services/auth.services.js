// import { pool } from "../db.js";

// const registerNewUser = async ({ userData }) => {
//   try {
//     const [rows] = await pool.query("INSERT INTO users SET ?", userData);
//     if (rows.affectedRows) return { success: [rows] };
//   } catch (error) {
//     console.log(error);
//     return { fail: error.sqlMessage };
//   }
// };

// const getUserData = async ({ username }) => {
//   try {
//     const [rows] = await pool.query(
//       `SELECT * FROM users WHERE login_username = ?`,
//       username
//     );
//     const data = { user: rows[0] };
//     return { success: data };
//   } catch (error) {
//     return { fail: error.sqlMessage };
//   }
// };

// const updateUserData = async ({ userData }) => {
//   try {
//     const [rows] = await pool.query(
//       `UPDATE users SET ? WHERE login_username = ?`,
//       [userData, userData.login_username]
//     );
//     return { success: rows };
//   } catch (error) {
//     console.log(error.sqlMessage);
//     return { fail: error.sqlMessage };
//   }
// };

// const getLoginData = async (username) => {
//   try {
//     const [rows] = await pool.query(
//       `SELECT login_username, fullname_title, fullname_first, fullname_last, picture_thumbnail, user_cart, user_likes FROM users WHERE login_username = ?`,
//       username
//     );
//     const userData = rows[0];
//     return userData;
//   } catch (error) {
//     return { fail: error.sqlMessage };
//   }
// };

// export { registerNewUser, getUserData, updateUserData, getLoginData };
