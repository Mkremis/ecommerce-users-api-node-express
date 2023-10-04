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
        text: "INSERT INTO users(username, password, title, first, last, email, phone, thumbnail, city, state, street_number, street, country, postcode) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)",
        values: [
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

  async getUserByUsername({ username }) {
    try {
      const query = {
        text: "SELECT * FROM users WHERE username = $1",
        values: [username],
      };
      const { rows } = await this.pool.query(query);
      if (rows.length > 0) {
        const user_data = rows[0];
        return { success: user_data };
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
        text: "UPDATE users SET password = COALESCE($1, password), title = COALESCE($2, title), first = COALESCE($3, first), last = COALESCE($4, last), email = COALESCE($5, email), phone = COALESCE($6, phone), thumbnail = COALESCE($7, thumbnail), city = COALESCE($8, city), state = COALESCE($9, state), street_number = COALESCE($10, street_number), street = COALESCE($11, street), country = COALESCE($12, country), postcode = COALESCE($13, postcode) WHERE username = $14",
        values: [
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
          userData.username,
        ],
      };
      const { rowCount } = await this.pool.query(query);
      return { success: rowCount };
    } catch (error) {
      console.error(error);
      return { fail: error.message };
    }
  }

  async getUserCart({ username, id = null }) {
    try {
      console.log("id", id);
      if (!id) id = await this.getUserId({ username });
      if (id) {
        const query = {
          text: "SELECT user_cart FROM users_cart WHERE user_id = $1",
          values: [id],
        };
        const { rows } = await this.pool.query(query);
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
        const query = {
          text: `
        INSERT INTO users_carts (user_id, user_cart)
        VALUES ($1, $2)
        ON CONFLICT (user_id)
        DO UPDATE SET user_cart = $2
      `,
          values: [id, cart],
        };
        const { rowCount } = await this.pool.query(query);
        return { success: rowCount };
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
      console.log("id", id);
      if (!id) id = await this.getUserId({ username });
      if (id) {
        const query = {
          text: "SELECT user_likes FROM users_likes WHERE user_id = $1",
          values: [id],
        };
        const { rows } = await this.pool.query(query);
        if (rows.length > 0) {
          return { success: rows[0] };
        } else {
          return { success: { user_likes: [] } };
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
        const query = {
          text: `
        INSERT INTO users_likes (user_id, user_likes)
        VALUES ($1, $2)
        ON CONFLICT (user_id)
        DO UPDATE SET user_likes = $2
      `,
          values: [id, likes],
        };
        const { rowCount } = await this.pool.query(query);
        return { success: rowCount };
      } else {
        throw error; // Puedes manejar este error en el controlador
      }
    } catch (error) {
      console.error(error);
      throw error; // Puedes manejar este error en el controlador
    }
  }

  async getUserId({ username }) {
    try {
      const query = {
        text: "SELECT id FROM users WHERE username = $1",
        values: [username],
      };
      const {
        rows: [{ id }],
      } = await this.pool.query(query);
      return id;
    } catch (error) {
      console.log(error);
      throw error; // Puedes manejar este error en el controlador
    }
  }
}

export default PostgreSQLAdapter;
