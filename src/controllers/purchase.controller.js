import { getUserPurchasesService } from "../services/purchase.services.js";

export const getUserPurchasesController = async (req, res) => {
  try {
    const userId = req.user.id;
    const response = await getUserPurchasesService({ userId });
    return res.status(200).json({ purchases: response.success });
  } catch (error) {
    return res.status(400).json(response.error);
  }
};
