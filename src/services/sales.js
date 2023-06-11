import { pool } from "../db.js";

export const registerSale = (items, username, date, feeType) => {
  console.log("registerSale", items, username, date, feeType);
  items.forEach(async (item) => {
    const [rows] = await pool.query(
      `INSERT INTO sales (
          login_username,
          transactionType,
          transactionDate,
          gender,
          prodName,
          productQ,
          prodImage,
          prodPrice) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        username,
        feeType,
        new Date(date),
        item.category_id,
        item.title,
        parseInt(item.quantity),
        item.picture_url,
        parseFloat(item.unit_price),
      ]
    );
  });
};
