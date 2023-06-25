import { pool } from "../db.js";

export const registerSale = async (items, username, date, feeType) => {
  try {
    items.map(async (item) => {
      console.log("registerSale", item);
      await pool.query(
        `INSERT INTO sales (
        login_username,
        transactionType,
        transactionDate,
        gender,
        prodId,
        prodName,
        productQ,
        prodImage,
        prodPrice)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)`,
        [
          username,
          feeType,
          new Date(date),
          item.category_id,
          item.id,
          item.title,
          parseInt(item.quantity),
          item.picture_url,
          parseFloat(item.unit_price),
        ]
      );
    });
  } catch (error) {
    return { fail: error };
  }
};
