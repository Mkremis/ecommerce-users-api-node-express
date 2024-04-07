import pkg from "pg";
import { POSTGRES_URL } from "../config.js";
import { v4 as uuidv4 } from "uuid";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: POSTGRES_URL,
});

class PostgreSQLAdapter {
  constructor() {
    this.pool = pool;
    this.pool.connect((err, client, done) => {
      if (err) {
        console.error("Error connecting to PostgreSQL:", err);
      } else {
        console.log("Connected to PostgreSQL");
        done();
      }
    });
  }

  async query(text, params) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result.rows;
    } catch (err) {
      console.error("Error executing query:", err);
      throw err;
    } finally {
      client.release();
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
    const text = `
    INSERT INTO users (id, user_name, password, email, roles)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
    const values = [userId, userName, password, email, roles];
    try {
      const result = await this.query(text, values);

      // Obtener el ID del usuario insertado
      const newUserId = result[0].id;

      // Obtener el ID del rol en base al role_name
      const roleText = `
      SELECT id FROM role WHERE role_name = $1;
    `;

      const roleValues = roles;
      const roleResult = await this.query(roleText, roleValues);
      const roleId = roleResult[0].id;

      // Insertar el rol del usuario en la tabla user_role
      const userRoleText = `
      INSERT INTO user_role (user_id, role_id)
      VALUES ($1, $2);
    `;
      const userRoleValues = [newUserId, roleId];
      await this.query(userRoleText, userRoleValues);

      return { success: "User created successfully" };
    } catch (error) {
      console.error("Error registering new user:", error);
      throw error;
    }
  }

  async getUserByUsername({ userName }) {
    const text = `
      SELECT * FROM users
      WHERE user_name = $1;
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
      WHERE id = $1;
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
      WHERE user_id = $1;
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
    const {
      title = "",
      first = "",
      last = "",
      phone = "",
      thumbnail = "",
      city = "",
      state = "",
      street_number = "",
      street = "",
      country = "",
      postcode = "",
    } = userData;

    // Verificar si el usuario ya tiene un dashboard
    const existingDashboardQuery = `
    SELECT * FROM users_dashboard WHERE user_id = $1;
  `;
    const existingDashboardValues = [userId];
    const existingDashboard = await this.query(
      existingDashboardQuery,
      existingDashboardValues
    );

    if (existingDashboard.length > 0) {
      // Si el usuario ya tiene un dashboard, actualizarlo
      const updateDashboardQuery = `
      UPDATE users_dashboard
      SET title = $1, first = $2, last = $3, phone = $4, thumbnail = $5,
          city = $6, state = $7, street_number = $8, street = $9,
          country = $10, postcode = $11
      WHERE user_id = $12
      RETURNING *;
    `;
      const updateDashboardValues = [
        title,
        first,
        last,
        phone,
        thumbnail,
        city,
        state,
        street_number,
        street,
        country,
        postcode,
        userId,
      ];
      const updatedDashboard = await this.query(
        updateDashboardQuery,
        updateDashboardValues
      );

      if (updatedDashboard.length > 0) {
        return { success: updatedDashboard[0] };
      } else {
        throw new Error("Failed to update user dashboard");
      }
    } else {
      // Si el usuario no tiene un dashboard, crear uno nuevo
      const createDashboardQuery = `
      INSERT INTO users_dashboard (user_id, title, first, last, phone, thumbnail, city, state, street_number, street, country, postcode)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;
      const createDashboardValues = [
        userId,
        title,
        first,
        last,
        phone,
        thumbnail,
        city,
        state,
        street_number,
        street,
        country,
        postcode,
      ];
      const newDashboard = await this.query(
        createDashboardQuery,
        createDashboardValues
      );

      if (newDashboard.length > 0) {
        return { success: newDashboard[0] };
      } else {
        throw new Error("Failed to create user dashboard");
      }
    }
  }

  // Cart services
  async getCartByUserId({ userId }) {
    const text = `
      SELECT * FROM users_cart
      WHERE user_id = $1;
    `;
    const values = [userId];
    try {
      const result = await this.query(text, values);
      return this.formatResult(result);
    } catch (error) {
      console.error("Error getting user cart:", error);
      throw error;
    }
  }

  async updateUserCart({ userId, newCartItem }) {
    const text = `
      INSERT INTO users_cart (user_id, prod_id, prod_name, prod_price, prod_image, price_currency, prod_gender, productq)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (user_id, prod_id) DO UPDATE
      SET productq = $8
      RETURNING *;
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

  async deleteCartItem({ userId, cartId }) {
    const text = `
      DELETE FROM users_cart
      WHERE user_id = $1 AND id = $2;
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
      WHERE user_id = $1;
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

  // Likes services
  async getLikesByUserId({ userId }) {
    const text = `
      SELECT * FROM users_likes
      WHERE user_id = $1;
    `;
    const values = [userId];
    try {
      const result = await this.query(text, values);
      return this.formatResult(result);
    } catch (error) {
      console.error("Error getting user likes:", error);
      throw error;
    }
  }

  async saveUserLike({ userId, newLike }) {
    const text = `
      INSERT INTO users_likes (user_id, prod_id, prod_name, prod_price, prod_image, price_currency, prod_gender)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
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
      WHERE user_id = $1 AND prod_id = $2;
    `;
    const values = [userId, prodId];
    try {
      const result = await this.query(text, values);
      return result ? { success: true } : { success: false };
    } catch (error) {
      console.error("Error deleting user like:", error);
      throw error;
    }
  }

  // Purchases services
  async createPurchase({ userId, purchasedItems }) {
    const savePurchase = async (item) => {
      const text = `
      INSERT INTO purchases (user_id, order_id, prod_id, prod_name, prod_price, prod_image, prod_gender, productq)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
      const values = [
        userId,
        item.order_id,
        item.prodId,
        item.prodName,
        item.prodPrice,
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
      WHERE user_id = $1;
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
      WHERE user_id = $1 AND order_id = $2
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
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
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
      WHERE id = $1;
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

export default PostgreSQLAdapter;
