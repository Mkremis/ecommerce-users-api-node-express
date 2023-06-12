import { pool } from "../db.js";

export const registerSale = async (items, username, date, feeType) => {
  items.map(async (item) => {
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
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
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
};

//  const query = `UPDATE sales SET login_username=?, transactionType=?, transactionDate=?, gender=?, prodName=?, productQ=?, prodImage=?, prodPrice=? WHERE login_username=?`;

//   items.map(async (item) => {
//     const [rows] = await pool.query(query, [
//       username,
//       feeType,
//       new Date(date),
//       item.category_id,
//       item.title,
//       parseInt(item.quantity),
//       item.picture_url,
//       parseFloat(item.unit_price),
//       username, // Agregado el valor para el WHERE
//     ]);
//     console.log("registerSale", rows);
//   });
