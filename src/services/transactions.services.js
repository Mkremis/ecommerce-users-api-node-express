import db from "../index.js";

export const getTransactionService = async ({ transactionId }) => {
  try {
    const transaction = await db.getTransactionById({ transactionId });
    return transaction;
  } catch (error) {
    console.error("Error getting transactions:", error);
    throw error;
  }
};
