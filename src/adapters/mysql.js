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
    try {
      const [rows] = await this.pool.query(text, params);
      return rows;
    } catch (err) {
      console.error("Error executing query:", err);
      throw err;
    }
  }
  formatResult(result) {
    return result.map((row) => ({
      id: row?.id,
      priceCurrency: row?.price_currency,
      prodGender: row?.prod_gender,
      prodId: row?.prod_id,
      prodImage: row?.prod_image,
      prodName: row?.prod_name,
      prodPrice: row?.prod_price,
      productQ: row?.productq,
      order_id: row?.order_id,
    }));
  }

  // User services
  async registerNewUser({ registerData }) {
    const { userName, password, email, roles } = registerData;
    const userId = uuidv4(); // Generar un UUID para el nuevo usuario
    const text = `INSERT INTO users (id, user_name, password, email) VALUES (?, ?, ?, ?)`;
    const values = [userId, userName, password, email, roles];
    try {
      const resultInsertUser = await this.query(text, values);

      if (!resultInsertUser.affectedRows) return { fail: "User not created" };

      if (resultInsertUser.affectedRows) {
        for (const roleName of roles) {
          // Obtener el ID del rol en base al role_name
          const roleText = `SELECT id FROM role WHERE role_name = ?`;
          const roleValue = roleName;
          const roleResult = await this.query(roleText, roleValue);
          const roleId = roleResult[0].id;
          // Insertar el rol del usuario en la tabla user_role
          const userRoleText = `INSERT INTO user_role(user_id, role_id) VALUES (?, ?)`;
          const userRoleValues = [userId, roleId];
          await this.query(userRoleText, userRoleValues);
        }
        return { success: "User created successfully", userId };
      }
    } catch (error) {
      console.error("Error registering new user:", error);
      throw error;
    }
  }

  async getUserByUsername({ userName }) {
    const text = `
      SELECT * FROM users
      WHERE user_name = ?;
    `;
    const values = [userName];
    try {
      const result = await this.query(text, values);
      return result.length
        ? { success: result[0] }
        : { fail: "User not found" };
    } catch (error) {
      console.error("Error getting user by username:", error);
      throw error;
    }
  }

  async getUserById({ userId }) {
    const text = `
      SELECT * FROM users
      WHERE id = ?;
    `;
    const values = [userId];
    try {
      const result = await this.query(text, values);
      return result.length
        ? { success: result[0] }
        : { fail: "User not found" };
    } catch (error) {
      console.error("Error getting user by ID:", error);
      throw error;
    }
  }

  async getUserDataById({ userId }) {
    const text = `
      SELECT city, country, email, first, last, phone, postcode, state, street, street_number AS streetNumber, thumbnail, title
      FROM users_dashboard
      WHERE user_id = ?;
    `;
    const values = [userId];
    try {
      const result = await this.query(text, values);
      return result.length ? { success: result[0] } : { success: {} };
    } catch (error) {
      console.error("Error getting user data by ID:", error);
      throw error;
    }
  }

  async updateUserData({ userData, userId }) {
    let result;
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
        userData.streetNumber || "",
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

      result = await this.query(
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

        result = await this.query(updatePassQuery, updateUsersValues);
      }

      return result.affectedRows
        ? { success: "User data updated" }
        : { fail: "User data not updated" };
    } catch (error) {
      console.error("Error updating user data:", error);
      throw error;
    }
  }

  // Cart services
  async getCartByUserId({ userId }) {
    const text = `
        SELECT id, price_currency AS priceCurrency, prod_Gender AS prodGender, prod_id AS prodId, prod_image AS prodImage, prod_name AS prodName, prod_price AS prodPrice, productq AS productQ
        FROM users_cart
        WHERE user_id = ?
      `;
    const values = [userId];
    try {
      const result = await this.query(text, values);
      return result;
    } catch (error) {
      console.error("Error getting cart by user ID:", error);
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

      return result.affectedRows
        ? this.getCartByUserId({ userId })
        : { fail: "Cart not updated" };
    } catch (error) {
      console.error("Error updating user cart:", error);
      throw error;
    }
  }

  async deleteCartItem({ userId, cartId }) {
    const text = `
      DELETE FROM users_cart
      WHERE user_id = ? AND id = ?;
    `;
    const values = [userId, cartId];
    try {
      await this.query(text, values);
      return this.getCartByUserId({ userId });
    } catch (error) {
      console.error("Error deleting item from cart:", error);
      throw error;
    }
  }

  async deleteUserCart({ userId }) {
    const text = `
      DELETE FROM users_cart
      WHERE user_id = ?;
    `;
    const values = [userId];
    try {
      await this.query(text, values);
      return { success: "Cart deleted successfully" };
    } catch (error) {
      console.error("Error deleting cart:", error);
      throw error;
    }
  }

  // Like services
  async getLikesByUserId({ userId }) {
    const text = `
        SELECT id, price_currency AS priceCurrency, prod_gender AS prodGender, prod_id AS prodId, prod_image AS prodImage, prod_name AS prodName, prod_price AS prodPrice
        FROM users_likes
        WHERE user_id = ?
      `;
    const values = [userId];
    try {
      const result = await this.query(text, values);
      return result;
    } catch (error) {
      console.error("Error getting likes by user ID:", error);
      throw error;
    }
  }

  async saveUserLike({ userId, newLike }) {
    const text = `
    INSERT IGNORE INTO users_likes (user_id, prod_id, prod_name, prod_price, prod_image, price_currency, prod_gender)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
    const values = [
      userId,
      newLike.prodId,
      newLike.prodName,
      newLike.prodPrice,
      newLike.prodImage,
      newLike.priceCurrency,
      newLike.prodGender,
    ];
    try {
      await this.query(text, values);
      return { success: true };
    } catch (error) {
      console.error("Error saving user like:", error);
      throw error;
    }
  }

  async deleteUserLikeByProdId({ userId, prodId }) {
    const text = `
      DELETE FROM users_likes
      WHERE user_id = ? AND prod_id = ?;
    `;
    const values = [userId, prodId];
    try {
      const result = await this.query(text, values);
      return result.affectedRows ? { success: true } : { success: false };
    } catch (error) {
      console.error("Error deleting user like:", error);
      throw error;
    }
  }

  // Purchases services
  async createPurchase({ userId, purchasedItems }) {
    const savePurchase = async (item) => {
      const text = `
      INSERT INTO purchases (user_id, order_id, prod_id, prod_name, prod_price, price_currency, prod_image, prod_gender, productq)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
      const values = [
        userId,
        item.order_id,
        item.prodId,
        item.prodName,
        item.prodPrice,
        item.currency_id,
        item.prodImage,
        item.prodGender,
        item.productQ,
      ];
      try {
        await this.query(text, values);
        return { success: true };
      } catch (error) {
        console.error("Error saving user purchase:", error);
        throw error;
      }
    };
    purchasedItems.forEach((item) => savePurchase(item));
  }

  async getPurchasesByUserId({ userId }) {
    const text = `
      SELECT * FROM purchases
      WHERE user_id = ?;
    `;
    const values = [userId];
    try {
      const result = await this.query(text, values);
      return result.length ? this.formatResult(result) : [];
    } catch (error) {
      console.error("Error getting user purchases:", error);
      throw error;
    }
  }

  async getPurchasesByTrId({ userId, transactionId }) {
    const text = `
      SELECT * FROM purchases
      WHERE user_id = ? AND order_id = ?
    `;
    const values = [userId, transactionId];
    try {
      const result = await this.query(text, values);
      return result.length ? this.formatResult(result) : [];
    } catch (error) {
      console.error("Error getting purchases by transaction ID:", error);
      throw error;
    }
  }

  // Transactions services
  async createTransaction({ transactionData }) {
    const text = `
      INSERT INTO transactions (id, user_id, transaction_date, status_detail, payment_method, total_paid_amount, shipping_amount, card_number, order_type, currency_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const values = [
      transactionData._id,
      transactionData.userId,
      transactionData.transaction_date,
      transactionData.status_detail,
      transactionData.payment_method,
      transactionData.total_paid_amount,
      transactionData.shipping_amount,
      transactionData.card_number,
      transactionData.order_type,
      transactionData.currency_id,
    ];
    try {
      await this.query(text, values);
      return { success: true };
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  }

  async getTransactionById({ transactionId }) {
    const text = `
      SELECT * FROM transactions
      WHERE id = ?;
    `;
    const values = [transactionId];
    try {
      const result = await this.query(text, values);
      return result.length
        ? { success: result[0] }
        : { fail: "Transaction not found" };
    } catch (error) {
      console.error("Error getting transaction by ID:", error);
      throw error;
    }
  }
}

export default MySQLAdapter;
