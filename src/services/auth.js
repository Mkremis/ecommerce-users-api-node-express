import { pool } from "../db.js";
import { encrypt, verified } from "../utils/bcryptHandle.js";
import { generateToken } from "../utils/jwtHandle.js";

const registerNewUser = async ({ userData }) => {
  userData.login_password = await encrypt(userData.login_password);

  try {
    // inserta el usuario en la tabla users
    const [rows] = await pool.query(
      "INSERT INTO users (login_password, login_username, fullname_title, fullname_first, fullname_last, contact_email, contact_phone, picture_thumbnail, location_city, location_state, location_number, location_street, location_country, location_postcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        userData.login_password,
        userData.login_username,
        userData.fullName_title,
        userData.fullName_first,
        userData.fullName_last,
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
  const isCorrect = await verified(login_password, passwordHash);
  if (!isCorrect) return "INCORRECT_PASSWORD";
  const token = generateToken(login_username);
  const [rows] = await pool.query(
    `SELECT * FROM users WHERE login_username = ?`,
    login_username
  );
  const data = { token, user: rows[0] };

  return data;
};

export { registerNewUser, loginUser };
