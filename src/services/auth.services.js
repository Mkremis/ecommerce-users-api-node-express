import { pool } from '../db.js';

const registerNewUser = async ({ userData }) => {
  try {
    const [rows] = await pool.query(
      'INSERT INTO users (login_password, login_username, fullname_title, fullname_first, fullname_last, contact_email, contact_phone, picture_thumbnail, location_city, location_state, location_number, location_street, location_country, location_postcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        userData.login_password,
        userData.login_username,
        userData.fullname_title,
        userData.fullname_first,
        userData.fullname_last,
        userData.contact_email,
        userData.contact_phone,
        userData.picture_thumbnail,
        userData.location_city,
        userData.location_state,
        userData.location_number,
        userData.location_street,
        userData.location_country,
        userData.location_postcode,
      ]
    );
    if (rows.affectedRows) return { success: rows };
  } catch (error) {
    return { fail: error };
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
    const query = `
      UPDATE users 
      SET 
        login_username = ?,
        login_password = ?,
        fullname_title = ?,
        fullname_first = ?,
        fullname_last = ?,
        contact_email = ?,
        contact_phone = ?,
        picture_thumbnail = ?,
        location_city = ?,
        location_state = ?,
        location_number = ?,
        location_street = ?,
        location_country = ?,
        location_postcode = ?
      WHERE login_username = ?
    `;

    const [rows] = await pool.query(query, [
      userData.login_username,
      userData.login_password,
      userData.fullname_title,
      userData.fullname_first,
      userData.fullname_last,
      userData.contact_email,
      userData.contact_phone,
      userData.picture_thumbnail,
      userData.location_city,
      userData.location_state,
      userData.location_number,
      userData.location_street,
      userData.location_country,
      userData.location_postcode,
      userData.login_username, // Agregado el valor para el WHERE
    ]);
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
