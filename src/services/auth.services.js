import { pool } from "../db.js";
import { encrypt, verified } from "../utils/bcryptHandle.js";
import { generateToken, refreshToken } from "../utils/jwtHandle.js";

const registerNewUser = async ({ userData }) => {
  userData.login_password = await encrypt(userData.login_password);
  try {
    const [rows] = await pool.query(
      "INSERT INTO users (login_password, login_username, fullname_title, fullname_first, fullname_last, contact_email, contact_phone, picture_thumbnail, location_city, location_state, location_number, location_street, location_country, location_postcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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

const loginUser = async ({ login_username, login_password, passwordHash }) => {
  try {
    const isCorrect = await verified(login_password, passwordHash);
    if (!isCorrect) return "INCORRECT_PASSWORD";
    const token = generateToken(login_username);
    const freshToken = refreshToken(login_username);
    saveFreshToken(freshToken, login_username);
    const [rows] = await pool.query(
      `SELECT login_username, fullname_title, fullname_first, fullname_last, picture_thumbnail, user_cart, user_likes FROM users WHERE login_username = ?`,
      login_username
    );
    const userData = { token, user: rows[0] };
    return { freshToken, userData };
  } catch (error) {
    return { fail: error };
  }
};

const getData = async ({ username }) => {
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
  userData.login_password = await encrypt(userData.login_password);
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

const saveFreshToken = async (freshToken, login_username) => {
  const query = `UPDATE users SET refresh_token = ? WHERE login_username = ?`;
  await pool.query(query, [freshToken, login_username]);
};

export { registerNewUser, loginUser, getData, updateUserData };
