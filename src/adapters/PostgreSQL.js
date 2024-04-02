import pkg from "pg";
import { POSTGRES_URL } from "../config.js";
import { v4 as uuidv4 } from "uuid";

const { Pool } = pkg;

class PostgreSQLAdapter {
  constructor() {
    this.pool = new Pool({
      connectionString: POSTGRES_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.pool.on("connect", () => {
      console.log("Conectado a la base de datos PostgreSQL");
    });

    this.pool.on("error", (err) => {
      console.error("Error en la conexión a la base de datos:", err);
    });
  }

  async registerNewUser({ registerData }) {
    try {
      const userId = uuidv4();

      const queryInsertUser = `
        INSERT INTO users(id, user_name, password, email)
        VALUES ($1, $2, $3, $4)
      `;
      const valuesInsertUser = [
        userId,
        registerData.userName,
        registerData.password,
        registerData.email,
      ];

      const resultInsertUser = await this.pool.query(
        queryInsertUser,
        valuesInsertUser
      );

      if (resultInsertUser.rowCount > 0) {
        const roles = registerData.roles || [];

        for (const roleName of roles) {
          const queryGetRoleId = `
            SELECT id FROM role WHERE role_name = $1
          `;
          const roleResult = await this.pool.query(queryGetRoleId, [roleName]);

          if (roleResult.rowCount > 0) {
            const roleId = roleResult.rows[0].id;

            const queryInsertUserRole = `
              INSERT INTO user_role(user_id, role_id)
              VALUES ($1, $2)
            `;
            const valuesInsertUserRole = [userId, roleId];
            await this.pool.query(queryInsertUserRole, valuesInsertUserRole);
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
        FROM users WHERE user_name = $1
      `;
      const { rows } = await this.pool.query(query, [userName]);

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
        SELECT user_name AS "userName", email
        FROM users WHERE id = $1
      `;
      const { rows } = await this.pool.query(query, [userId]);

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
        SELECT city, country, email, first, last, phone, postcode, state, street, street_number AS "streetNumber", thumbnail, title
        FROM users_dashboard
        WHERE user_id = $1
      `;
      const { rows } = await this.pool.query(query, [userId]);

      if (rows.length > 0) {
        return rows[0];
      } else {
        return null; // Return null when no user data is found
      }
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
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (user_id) DO UPDATE
        SET
          title = COALESCE(EXCLUDED.title, users_dashboard.title),
          first = COALESCE(EXCLUDED.first, users_dashboard.first),
          last = COALESCE(EXCLUDED.last, users_dashboard.last),
          email = COALESCE(EXCLUDED.email, users_dashboard.email),
          phone = COALESCE(EXCLUDED.phone, users_dashboard.phone),
          thumbnail = COALESCE(EXCLUDED.thumbnail, users_dashboard.thumbnail),
          city = COALESCE(EXCLUDED.city, users_dashboard.city),
          state = COALESCE(EXCLUDED.state, users_dashboard.state),
          street_number = COALESCE(EXCLUDED.street_number, users_dashboard.street_number),
          street = COALESCE(EXCLUDED.street, users_dashboard.street),
          country = COALESCE(EXCLUDED.country, users_dashboard.country),
          postcode = COALESCE(EXCLUDED.postcode, users_dashboard.postcode)
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
        userData.streetNumber || "",
        userData.street || "",
        userData.country || "",
        userData.postcode || "",
      ];

      await this.pool.query(
        updateUserDashboardQuery,
        updateUserDashboardValues
      );

      if (userData.password) {
        const updatePassQuery = `
          UPDATE users
          SET password = $1
          WHERE id = $2
        `;
        const updateUsersValues = [userData.password, userId];

        await this.pool.query(updatePassQuery, updateUsersValues);
      }

      return { success: true };
    } catch (error) {
      console.error("Error updating user data:", error);
      throw error;
    }
  }

  async getCartByUserId({ userId }) {
    try {
      const query = `
        SELECT id, price_currency AS "priceCurrency", prod_Gender AS "prodGender", prod_id AS "prodId", prod_image AS "prodImage", prod_name AS "prodName", prod_price AS "prodPrice", productq AS "productQ"
        FROM users_cart
        WHERE user_id = $1
      `;
      const { rows } = await this.pool.query(query, [userId]);
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
        WHERE user_id = $1 AND prod_id = $2
      `;
      const { rows } = await this.pool.query(query, [userId, prodId]);

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
    try {
      const prodId = newCartItem.prodId;
      const productQ = newCartItem.productQ;
      let result;
      const existingCartItem = await this.getUserCartItem({
        userId,
        prodId: newCartItem.prodId,
      });
      if (existingCartItem) {
        const query = `
          UPDATE users_cart
          SET productq = $1
          WHERE user_id = $2 AND prod_id = $3
        `;
        const values = [productQ, userId, prodId];
        await this.pool.query(query, values);
        result = { success: true };
      } else {
        result = await this.saveUserCartItem({
          userId,
          cartItem: newCartItem,
        });
      }
      if (result.success) {
        return await this.getCartByUserId({ userId });
      }
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
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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

      await this.pool.query(query, values);
      return { success: true };
    } catch (error) {
      console.error("Error saving user cart item:", error);
      throw error;
    }
  }

  async deleteCartItem({ userId, cartId }) {
    try {
      const query = `
        DELETE FROM users_cart 
        WHERE id = $1
      `;
      await this.pool.query(query, [cartId]);
      return await this.getCartByUserId({ userId });
    } catch (error) {
      console.error("Error deleting user cart item:", error);
      throw error;
    }
  }

  async getLikesByUserId({ userId }) {
    try {
      const query = `
        SELECT id, price_currency AS "priceCurrency", prod_gender AS "prodGender", prod_id AS "prodId", prod_image AS "prodImage", prod_name AS "prodName", prod_price AS "prodPrice"
        FROM users_likes
        WHERE user_id = $1
      `;
      const { rows } = await this.pool.query(query, [userId]);
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
        VALUES ($1, $2, $3, $4, $5, $6, $7)
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

      await this.pool.query(query, values);
      return { success: true };
    } catch (error) {
      console.error("Error saving user like:", error);
      throw error;
    }
  }

  async deleteUserLikeByProdId({ userId, prodId }) {
    try {
      const query = `
        DELETE FROM users_likes 
        WHERE user_id = $1 AND prod_id = $2
      `;
      await this.pool.query(query, [userId, prodId]);
      return { success: true };
    } catch (error) {
      console.error("Error deleting user like:", error);
      throw error;
    }
  }
}

export default PostgreSQLAdapter;
