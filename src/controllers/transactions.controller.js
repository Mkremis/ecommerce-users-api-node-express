import { getTransactionService } from "../services/transactions.services.js";

export const getTransactionController = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const transaction = await getTransactionService({ transactionId });
    const transactionItems = await getPurchasesByTrIdService({ transactionId });
    if (transaction.success && transactionItems.success) {
      res.status(200).json({
        transaction: transaction.success,
        items: transactionItems.success,
      });
      return;
    }
    {
      res.status(200).json(result.success);
      return;
    }
  } catch (error) {
    res.status(400).json(error);
    return;
  }
};
export const getPurchasesByTrIdController = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const result = await getPurchasesByTrIdService({ transactionId });
    if (result.success) {
      res.status(200).json(result.success);
      return;
    }
  } catch (error) {
    res.status(400).json(error);
    return;
  }
};
