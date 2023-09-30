import pg from "pg";
import { POSTGRES_URL } from "../config.js";

const { Pool } = pg;

class PostgreSQLAdapter {
  constructor() {
    this.pool = new Pool({
      connectionString: POSTGRES_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    this.pool.on("error", (err) => {
      console.error("Error en la conexión a la base de datos:", err);
    });

    this.pool.on("connect", () => {
      console.log("Conectado a la base de datos PostgreSQL");
    });
  }

  async registerNewUser({ userData }) {
    try {
      const query = {
        text: "INSERT INTO users(login_username, login_password, fullname_title, fullname_first, fullname_last, contact_email, contact_phone, picture_thumbnail, location_city, location_state, location_number, location_street, location_country, location_postcode) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)",
        values: [
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
        ],
      };
      const { rowCount } = await this.pool.query(query);
      console.log(rowCount);
      if (rowCount) return { success: "User created successfully" };
    } catch (error) {
      console.error(error);
      return { fail: error.message };
    }
  }

  async getUserByUsername(username) {
    try {
      const query = {
        text: "SELECT * FROM users WHERE login_username = $1",
        values: [username],
      };
      const { rows } = await this.pool.query(query);
      if (rows.length > 0) {
        const data = { user: rows[0] };
        return { success: data };
      } else {
        return { fail: "User not found" };
      }
    } catch (error) {
      console.error(error);
      return { fail: error.message };
    }
  }

  async updateUserData({ userData }) {
    try {
      const query = {
        text: "UPDATE users SET login_password = COALESCE($1, login_password), fullname_title = COALESCE($2, fullname_title), fullname_first = COALESCE($3, fullname_first), fullname_last = COALESCE($4, fullname_last), contact_email = COALESCE($5, contact_email), contact_phone = COALESCE($6, contact_phone), picture_thumbnail = COALESCE($7, picture_thumbnail), location_city = COALESCE($8, location_city), location_state = COALESCE($9, location_state), location_number = COALESCE($10, location_number), location_street = COALESCE($11, location_street), location_country = COALESCE($12, location_country), location_postcode = COALESCE($13, location_postcode) WHERE login_username = $14",
        values: [
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
          userData.login_username,
        ],
      };
      const { rowCount } = await this.pool.query(query);
      return { success: rowCount };
    } catch (error) {
      console.error(error);
      return { fail: error.message };
    }
  }

  async getLoginData(username) {
    try {
      const query = {
        text: "SELECT login_username, fullname_title, fullname_first, fullname_last, picture_thumbnail, location_city, location_state, location_number, location_street, location_country, location_postcode FROM users WHERE login_username = $1",
        values: [username],
      };
      const { rows } = await this.pool.query(query);
      if (rows.length > 0) {
        return rows[0];
      } else {
        return { fail: "User not found" };
      }
    } catch (error) {
      console.error(error);
      return { fail: error.message };
    }
  }
}

export default PostgreSQLAdapter;
