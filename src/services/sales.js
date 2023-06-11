import { pool } from "../db.js";

export const registerSale = (items, username, date, feeType) => {
  console.log("registerSale", items, username, date, feeType);
};

//   try {
//     // inserta el usuario en la tabla users
//     const [rows] = await pool.query(
//       "INSERT INTO users (login_password, login_username, fullname_title, fullname_first, fullname_last, contact_email, contact_phone, picture_thumbnail, location_city, location_state, location_number, location_street, location_country, location_postcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
//       [
//         userData.login_password,
//         userData.login_username,
//         userData.fullname_title,
//         userData.fullname_first,
//         userData.fullname_last,
//         userData.contact_email,
//         userData.contact_phone,
//         userData.picture_thumbnail,
//         userData.location_city,
//         userData.location_state,
//         userData.location_number,
//         userData.location_street,
//         userData.location_country,
//         userData.location_postcode,
//       ]
//     );
//     if (rows.affectedRows) return { success: rows };
//   } catch (error) {
//     return { fail: error };
//   }
