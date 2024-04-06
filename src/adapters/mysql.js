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
  async query(text, params) {
    const client = this.pool;
    try {
      const result = await client.execute(text, params);
      return result.rows;
    } catch (err) {
      console.error("Error executing query:", err);
      throw err;
    }
  }
  // User services
  async registerNewUser({ registerData }) {
    try {
      const userId = uuidv4(); // Removed unnecessary "format: 'binary'"

      const queryInsertUser = `
        INSERT INTO users(id, user_name, password, email)
        VALUES (?, ?, ?, ?)
      `;
      const valuesInsertUser = [
        userId,
        registerData.userName,
        registerData.password,
        registerData.email,
      ];

      const [resultInsertUser] = await this.pool.execute(
        queryInsertUser,
        valuesInsertUser
      );

      if (resultInsertUser.affectedRows) {
        const roles = registerData.roles || [];

        for (const roleName of roles) {
          const queryGetRoleId = `
            SELECT id FROM role WHERE role_name = ?
          `;
          const [roleResult] = await this.pool.execute(queryGetRoleId, [
            roleName,
          ]);

          if (roleResult.length > 0) {
            const roleId = roleResult[0].id;

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
      console.error("Error registering new user:", error);
      throw error;
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
      console.error("Error getting user by username:", error);
      throw error;
    }
  }

  async getUserById({ userId }) {
    try {
      const query = `
        SELECT user_name AS userName, email
        FROM users WHERE id = ?
      `;
      const [rows] = await this.pool.execute(query, [userId]);

      if (rows.length > 0) {
        return { success: rows[0] };
      } else {
        return { fail: "User not found" };
      }
    } catch (error) {
      console.error("Error getting user by ID:", error);
      throw error;
    }
  }

  async getUserDataById({ userId }) {
    try {
      const query = `
        SELECT city, country, email, first, last, phone, postcode, state, street, street_number AS streetNumber, thumbnail, title
        FROM users_dashboard
        WHERE user_id = ?
      `;
      const [rows] = await this.pool.execute(query, [userId]);

      return rows.length ? { success: rows[0] } : { success: {} };
    } catch (error) {
      console.error("Error getting user data by ID:", error);
      throw error;
    }
  }

  async updateUserData({ userData, userId }) {
    try {
      // Update users_dashboard
      const updateUserDashboardQuery = `
        INSERT INTO users_dashboard (user_id, title, first, last, email, phone, thumbnail, city, state, street_number, street, country, postcode)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title = COALESCE(?, title),
          first = COALESCE(?, first),
          last = COALESCE(?, last),
          email = COALESCE(?, email),
          phone = COALESCE(?, phone),
          thumbnail = COALESCE(?, thumbnail),
          city = COALESCE(?, city),
          state = COALESCE(?, state),
          street_number = COALESCE(?, street_number),
          street = COALESCE(?, street),
          country = COALESCE(?, country),
          postcode = COALESCE(?, postcode)
      `;
      const updateUserDashboardValues = [
        userId,
        userData.title || "",
        userData.first || "",
        userData.last || "",
        userData.email || "",
        userData.phone || "",
        userData.thumbnail || "",
        userData.city || "",
        userData.state || "",
        userData.street_number || "",
        userData.street || "",
        userData.country || "",
        userData.postcode || "",
        // These values below are for the ON DUPLICATE KEY UPDATE part
        userData.title || "",
        userData.first || "",
        userData.last || "",
        userData.email || "",
        userData.phone || "",
        userData.thumbnail || "",
        userData.city || "",
        userData.state || "",
        userData.streetNumber || "",
        userData.street || "",
        userData.country || "",
        userData.postcode || "",
      ];

      const dashUpdate = await this.pool.execute(
        updateUserDashboardQuery,
        updateUserDashboardValues
      );

      if (userData.password) {
        const updatePassQuery = `
          UPDATE users
          SET password = ?
          WHERE id = ?
        `;
        const updateUsersValues = [userData.password, userId];

        await this.pool.execute(updatePassQuery, updateUsersValues);
      }

      return { success: true };
    } catch (error) {
      console.error("Error updating user data:", error);
      throw error;
    }
  }

  // Cart services
  async getCartByUserId({ userId }) {
    try {
      const query = `
        SELECT id, price_currency AS priceCurrency, prod_Gender AS prodGender, prod_id AS prodId, prod_image AS prodImage, prod_name AS prodName, prod_price AS prodPrice, productq AS productQ
        FROM users_cart
        WHERE user_id = ?
      `;
      const [rows] = await this.pool.execute(query, [userId]);
      return rows;
    } catch (error) {
      console.error("Error getting cart by user ID:", error);
      throw error;
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
        return rows[0];
      } else {
        return null; // Return null when no user cart item is found
      }
    } catch (error) {
      console.error("Error getting user cart item:", error);
      throw error;
    }
  }
  async updateUserCart({ userId, newCartItem }) {
    const text = `
      INSERT INTO users_cart (user_id, prod_id, prod_name, prod_price, prod_image, price_currency, prod_gender, productq)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      productq = VALUES(productq);
    `;
    const values = [
      userId,
      newCartItem.prodId,
      newCartItem.prodName,
      newCartItem.prodPrice,
      newCartItem.prodImage,
      newCartItem.priceCurrency,
      newCartItem.prodGender,
      newCartItem.productQ,
    ];
    try {
      const result = await this.query(text, values);
      return this.getCartByUserId({ userId });
    } catch (error) {
      console.error("Error updating user cart:", error);
      throw error;
    }
  }

  async saveUserCartItem({ userId, cartItem }) {
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
      return { success: rows.affectedRows > 0 };
    } catch (error) {
      console.error("Error saving user cart item:", error);
      throw error;
    }
  }

  async deleteCartItem({ userId, cartId }) {
    try {
      const query = `
        DELETE FROM users_cart 
        WHERE id = ?
      `;
      await this.pool.execute(query, [cartId]);
      return await this.getCartByUserId({ userId });
    } catch (error) {
      console.error("Error deleting user cart item:", error);
      throw error;
    }
  }

  // Like services
  async getLikesByUserId({ userId }) {
    try {
      const query = `
        SELECT id, price_currency AS priceCurrency, prod_gender AS prodGender, prod_id AS prodId, prod_image AS prodImage, prod_name AS prodName, prod_price AS prodPrice
        FROM users_likes
        WHERE user_id = ?
      `;
      const [rows] = await this.pool.execute(query, [userId]);
      return rows;
    } catch (error) {
      console.error("Error getting likes by user ID:", error);
      throw error;
    }
  }

  async saveUserLike({ userId, newLike }) {
    try {
      const query = `
        INSERT INTO users_likes (user_id, prod_id, prod_name, prod_gender, prod_image, prod_price, price_currency)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        userId,
        newLike.prodId,
        newLike.prodName,
        newLike.prodGender,
        newLike.prodImage,
        newLike.prodPrice,
        newLike.priceCurrency,
      ];

      const [rows] = await this.pool.execute(query, values);
      return { success: rows?.affectedRows > 0 };
    } catch (error) {
      console.error("Error saving user like:", error);
      throw error;
    }
  }

  async deleteUserLikeByProdId({ userId, prodId }) {
    try {
      const query = `
        DELETE FROM users_likes 
        WHERE user_id = ? AND prod_id = ?
      `;
      const [rows] = await this.pool.execute(query, [userId, prodId]);
      return { success: rows?.affectedRows > 0 };
    } catch (error) {
      console.error("Error deleting user like:", error);
      throw error;
    }
  }
}

export default MySQLAdapter;
