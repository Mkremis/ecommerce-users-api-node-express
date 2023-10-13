import mysql from "mysql2/promise";
import {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} from "../config.js";

class MySQLAdapter {
  constructor() {
    this.pool = mysql.createPool({
      host: MYSQL_HOST,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    this.pool.on("connection", (connection) => {
      console.log("Conectado a la base de datos MySQL");
    });

    this.pool.on("error", (err) => {
      console.error("Error en la conexión a la base de datos:", err);
    });
  }

  async registerNewUser({ userData }) {
    try {
      const query = `
        INSERT INTO users(username, password, title, first, last, email, phone, thumbnail, city, state, street_number, street, country, postcode)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        userData.username,
        userData.password,
        userData.title,
        userData.first,
        userData.last,
        userData.email,
        userData.phone,
        userData.thumbnail,
        userData.city,
        userData.state,
        userData.street_number,
        userData.street,
        userData.country,
        userData.postcode,
      ];

      const [rows] = await this.pool.execute(query, values);
      if (rows.affectedRows) return { success: "User created successfully" };
    } catch (error) {
      console.error(error);
      return { fail: error.message };
    }
  }

  async getUserByUsername({ username }) {
    try {
      const query = `
        SELECT HEX(id) AS id, username, password, title, first, last, email, phone, thumbnail, city, state, street_number, street, country, postcode
        FROM users WHERE username = ?
      `;
      const [rows] = await this.pool.execute(query, [username]);

      if (rows.length > 0) {
        const user_data = rows[0];
        user_data.id = this.convertHexToUUID(user_data.id);
        return { success: user_data };
      } else {
        return { fail: "User not found" };
      }
    } catch (error) {
      console.error(error);
      return { fail: error.message };
    }
  }

  async getUserById({ id }) {
    try {
      const query = `
        SELECT HEX(id) AS id, username, password, title, first, last, email, phone, thumbnail, city, state, street_number, street, country, postcode
        FROM users WHERE id = UUID_TO_BIN(?)
      `;
      const [rows] = await this.pool.execute(query, [id]);

      if (rows.length > 0) {
        const user_data = rows[0];
        user_data.id = this.convertHexToUUID(user_data.id);
        return { success: user_data };
      } else {
        return { fail: "User not found" };
      }
    } catch (error) {
      console.error(error);
      return { fail: error.message };
    }
  }

  async updateUserData({ userData, id }) {
    console.log(userData);
    try {
      const query = `
        UPDATE users
        SET username = COALESCE(?, username), password = COALESCE(?, password), title = COALESCE(?, title),
        first = COALESCE(?, first), last = COALESCE(?, last), email = COALESCE(?, email),
        phone = COALESCE(?, phone), thumbnail = COALESCE(?, thumbnail), city = COALESCE(?, city),
        state = COALESCE(?, state), street_number = COALESCE(?, street_number), street = COALESCE(?, street),
        country = COALESCE(?, country), postcode = COALESCE(?, postcode)
        WHERE id = UUID_TO_BIN(?)
      `;

      const values = [
        userData.username || null,
        userData.password || null,
        userData.title || null,
        userData.first || null,
        userData.last || null,
        userData.email || null,
        userData.phone || null,
        userData.thumbnail || null,
        userData.city || null,
        userData.state || null,
        userData.street_number || null,
        userData.street || null,
        userData.country || null,
        userData.postcode || null,
        id,
      ];

      const [rows] = await this.pool.execute(query, values);
      return { success: rows.affectedRows };
    } catch (error) {
      console.error(error);
      return { fail: error.message };
    }
  }

  async getUserCart({ username, id = null }) {
    try {
      if (!id) id = await this.getUserId({ username });
      if (id) {
        const query =
          "SELECT user_cart FROM users_cart WHERE user_id = UUID_TO_BIN(?)";
        const [rows] = await this.pool.execute(query, [id]);

        if (rows.length > 0) {
          return { success: rows[0] };
        } else {
          return { success: { user_cart: {} } };
        }
      } else {
        throw error; // Puedes manejar este error en el controlador
      }
    } catch (error) {
      console.error(error);
      throw error; // Puedes manejar este error en el controlador
    }
  }

  async updateUserCart({ username, cart }) {
    try {
      const id = await this.getUserId({ username });
      if (id) {
        const query = `
        INSERT INTO users_cart (user_id, user_cart)
        VALUES (UUID_TO_BIN(?), ?)
        ON DUPLICATE KEY UPDATE user_cart = VALUES(user_cart)
      `;
        const values = [id, JSON.stringify(cart)];

        const [rows] = await this.pool.execute(query, values);
        return { success: rows.affectedRows };
      } else {
        throw error; // Puedes manejar este error en el controlador
      }
    } catch (error) {
      console.error(error);
      throw error; // Puedes manejar este error en el controlador
    }
  }

  async getUserLikes({ username, id = null }) {
    try {
      if (!id) id = await this.getUserId({ username });
      if (id) {
        const query =
          "SELECT user_likes FROM users_likes WHERE user_id = UUID_TO_BIN(?)";
        const [rows] = await this.pool.execute(query, [id]);
        const likes = JSON.parse(rows[0].user_likes).likes;
        if (likes.length > 0) {
          return { success: likes };
        } else {
          return { success: [] };
        }
      } else {
        throw error; // Puedes manejar este error en el controlador
      }
    } catch (error) {
      console.error(error);
      throw error; // Puedes manejar este error en el controlador
    }
  }
  async updateUserLikes({ username, likes }) {
    try {
      const id = await this.getUserId({ username });
      if (id) {
        const query = `
        INSERT INTO users_likes (user_id, user_likes)
        VALUES (UUID_TO_BIN(?), ?)
        ON DUPLICATE KEY UPDATE user_likes = VALUES(user_likes)
      `;
        const values = [id, JSON.stringify(likes)];

        const [rows] = await this.pool.execute(query, values);
        return { success: rows.affectedRows };
      }
    } catch (error) {
      console.error(error);
      throw error; // Puedes manejar este error en el controlador
    }
  }

  async getUserId({ username }) {
    try {
      const query = "SELECT HEX(id) AS id FROM users WHERE username = ?";
      const [rows] = await this.pool.execute(query, [username]);

      if (rows.length > 0) {
        return this.convertHexToUUID(rows[0].id);
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      throw error; // Puedes manejar este error en el controlador
    }
  }

  // Agrega una función para convertir el formato hexadecimal a UUID
  convertHexToUUID(hex) {
    const uuid = `${hex.substr(0, 8)}-${hex.substr(8, 4)}-${hex.substr(
      12,
      4
    )}-${hex.substr(16, 4)}-${hex.substr(20)}`;
    console.log(uuid);

    return uuid;
  }
}

export default MySQLAdapter;
