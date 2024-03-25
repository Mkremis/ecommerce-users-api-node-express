import mysql from "mysql2/promise";
import {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} from "../config.js";
import { v4 as uuidv4 } from "uuid";

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

  //user services
  async registerNewUser({ userData }) {
    try {
      const userId = uuidv4({ format: "binary" });

      const queryInsertUser = `
      INSERT INTO users(id, user_name, password, email)
      VALUES (?, ?, ?, ?)
    `;
      const valuesInsertUser = [
        userId,
        userData.userName,
        userData.password,
        userData.email,
      ];

      const [resultInsertUser] = await this.pool.execute(
        queryInsertUser,
        valuesInsertUser
      );

      if (resultInsertUser.affectedRows) {
        const roles = userData.roles || []; // Roles del usuario

        for (const roleName of roles) {
          // Obtiene el role_id correspondiente al roleName
          const queryGetRoleId = `
          SELECT id FROM role WHERE role_name = ?
        `;
          const [roleResult] = await this.pool.execute(queryGetRoleId, [
            roleName,
          ]);

          if (roleResult.length > 0) {
            const roleId = roleResult[0].id;

            // Inserta el user_id y role_id en user_role
            const queryInsertUserRole = `
            INSERT INTO user_role(user_id, role_id)
            VALUES (?, ?)
          `;
            const valuesInsertUserRole = [userId, roleId];
            await this.pool.execute(queryInsertUserRole, valuesInsertUserRole);
          }
        }

        return { success: "User created successfully", userId };
      }
    } catch (error) {
      console.error(error);
      return { fail: error.message };
    }
  }

  async getUserByUsername({ userName }) {
    try {
      const query = `
        SELECT id, user_name, password, email
        FROM users WHERE user_name = ?
      `;
      const [rows] = await this.pool.execute(query, [userName]);

      if (rows.length > 0) {
        return { success: rows[0] };
      } else {
        return { fail: "User not found" };
      }
    } catch (error) {
      console.error(error);
      throw error; // Puedes manejar este error en el controlador
    }
  }

  async getUserById({ id }) {
    try {
      const query = `
        SELECT HEX(id) AS id, user_name, password, email
        FROM users WHERE id = ?
      `;
      const [rows] = await this.pool.execute(query, [id]);

      if (rows.length > 0) {
        const success = rows[0];
        success.id = this.convertHexToUUID(success.id);
        return success;
      } else {
        return { fail: "User not found" };
      }
    } catch (error) {
      console.error(error);
      throw error; // Puedes manejar este error en el controlador
    }
  }

  async getUserDataById({ id }) {
    try {
      const query = `
      SELECT city, country, email, first, last, phone, postcode, state, street, street_number AS streetNumber, thumbnail, title
      FROM users_dashboard
      WHERE user_id = ?
    `;
      const [rows] = await this.pool.execute(query, [id]);
      return rows[0];
    } catch (error) {
      console.error(error);
      throw error; // Puedes manejar este error en el controlador
    }
  }

  async getUserProfilePictureById({ id }) {
    try {
      const query = `
      SELECT thumbnail
      FROM users_dashboard
      WHERE user_id = ?
    `;
      const [rows] = await this.pool.execute(query, [id]);
      return rows[0];
    } catch (error) {
      console.error(error);
      throw error; // Puedes manejar este error en el controlador
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

  // cart services
  async getCartByUserId({ id }) {
    try {
      const query =
        "SELECT id, price_currency AS priceCurrency, prod_Gender AS prodGender, prod_id AS prodId, prod_image AS prodImage, prod_name AS prodName, prod_price AS prodPrice, productq AS productQ FROM users_cart WHERE user_id = ?";
      const [rows] = await this.pool.execute(query, [id]);
      return rows;
    } catch (error) {
      console.error(error);
      throw error; // Puedes manejar este error en el controlador
    }
  }

  async getUserCartItem({ userId, prodId }) {
    try {
      const query = `
      SELECT productq
      FROM users_cart
      WHERE user_id = ? AND prod_id = ?
    `;
      const [rows] = await this.pool.execute(query, [userId, prodId]);

      if (rows.length > 0) {
        // Si se encontró un resultado, devolver el primer elemento (debería ser único por user_id y prod_id)
        return rows[0];
      } else {
        return null; // Devuelve null si no se encuentra ningún resultado
      }
    } catch (error) {
      console.error(error);
      throw error; // Puedes manejar este error en el controlador
    }
  }

  async updateUserCartItem({ userId, prodId, productQ }) {
    try {
      const query = `
      UPDATE users_cart
      SET productq = ?
      WHERE user_id = ? AND prod_id = ?
    `;
      const values = [productQ, userId, prodId];

      const [rows] = await this.pool.execute(query, values);

      if (rows.affectedRows > 0) {
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error(error);
      return { success: false, error: "Error updating user cart item" };
    }
  }

  async saveUserCartItem({ userId, cartItem }) {
    console.log(userId, cartItem);
    try {
      const query = `
      INSERT INTO users_cart
      (user_id, prod_id, prod_name, prod_gender, prod_image, prod_price, price_currency, productq)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
      const values = [
        userId,
        cartItem.prodId,
        cartItem.prodName,
        cartItem.prodGender,
        cartItem.prodImage,
        cartItem.prodPrice,
        cartItem.priceCurrency,
        cartItem.productQ,
      ];

      const [rows] = await this.pool.execute(query, values);
      if (rows.affectedRows > 0) {
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error(error);
      return { success: false, error: "Error saving user cart item" };
    }
  }

  async deleteCartItem({ cartId }) {
    try {
      const query = `
      DELETE FROM users_cart 
      WHERE id = ?
    `;
      const values = [cartId];
      const [rows] = await this.pool.execute(query, values);
      return { success: rows.affectedRows > 0 };
    } catch (error) {
      console.error(error);
      throw error; // Puedes manejar este error en el controlador
    }
  }
  // like services
  async getLikesByUserId({ id }) {
    try {
      const query =
        "SELECT id, price_currency AS priceCurrency, prod_Gender AS prodGender, prod_id AS prodId, prod_image AS prodImage, prod_name AS prodName, prod_price AS prodPrice FROM users_likes WHERE user_id = ?";
      const [rows] = await this.pool.execute(query, [id]);
      return rows;
    } catch (error) {
      console.error(error);
      throw error; // Puedes manejar este error en el controlador
    }
  }

  async createUserLike({ id, newLike }) {
    console.log(id);
    console.log(newLike);

    try {
      const query = `
      INSERT INTO users_likes ( user_id, prod_id, prod_name, prod_gender, prod_image, prod_price, price_currency)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
      const values = [
        id,
        newLike.prodId,
        newLike.prodName,
        newLike.prodGender,
        newLike.prodImage,
        newLike.prodPrice,
        newLike.priceCurrency,
      ];

      const [rows] = await this.pool.execute(query, values);
      return { success: rows.affectedRows > 0 };
    } catch (error) {
      console.error(error);
      throw error; // Puedes manejar este error en el controlador
    }
  }

  async deleteUserLikeByProdId({ id, prodId }) {
    try {
      const query = `
      DELETE FROM users_likes 
      WHERE user_id = ? AND prod_id = ?
    `;
      const values = [id, prodId];

      const [rows] = await this.pool.execute(query, values);
      return { success: rows.affectedRows > 0 };
    } catch (error) {
      console.error(error);
      throw error; // Puedes manejar este error en el controlador
    }
  }
}

export default MySQLAdapter;
