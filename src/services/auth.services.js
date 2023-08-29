import { pool } from "../db.js";

const registerNewUser = async ({ userData }) => {
  const {
    login_username,
    login_password,
    fullname_title,
    fullname_first,
    fullname_last,
    contact_email,
    contact_phone,
    picture_thumbnail,
    location_city,
    location_state,
    location_number,
    location_street,
    location_country,
    location_postcode,
  } = userData;
  try {
    const [rows] = await pool.query("INSERT INTO users SET ?", {
      login_username,
      login_password,
      fullname_title,
      fullname_first,
      fullname_last,
      contact_email,
      contact_phone,
      picture_thumbnail,
      location_city,
      location_state,
      location_number,
      location_street,
      location_country,
      location_postcode,
    });
    if (rows.affectedRows) return { success: [rows] };
  } catch (error) {
    return { fail: [error.message] };
  }
};

const getUserData = async ({ username }) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM users WHERE login_username = ?`,
      username
    );
    const data = { user: rows[0] };
    return { success: data };
  } catch (error) {
    return { fail: error };
  }
};

const updateUserData = async ({ userData }) => {
  try {
    const [rows] = await pool.query(
      `UPDATE users SET ? WHERE login_username = ?`,
      [userData, userData.login_username]
    );
    return { success: rows };
  } catch (error) {
    return { fail: error };
  }
};

const getLoginData = async (username) => {
  try {
    const [rows] = await pool.query(
      `SELECT login_username, fullname_title, fullname_first, fullname_last, picture_thumbnail, user_cart, user_likes FROM users WHERE login_username = ?`,
      username
    );
    const userData = rows[0];
    return userData;
  } catch (error) {
    return { fail: error };
  }
};

export { registerNewUser, getUserData, updateUserData, getLoginData };
