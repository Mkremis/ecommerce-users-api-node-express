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

export const getPurchasesByTrIdService = async ({ transactionId }) => {
  try {
    const purchases = await db.getPurchasesByTransactionId({ transactionId });
    return purchases;
  } catch (error) {
    console.error("Error getting purchases:", error);
    throw error;
  }
};
