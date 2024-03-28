import Message from "../schemas/Message.js";
import {
  deleteCartItemService,
  updateCartService,
} from "../services/cart.services.js";

export const updateCartController = async (req, res) => {
  try {
    const userId = req?.user?.id;
    const newCartItem = req.body;
    const response = await updateCartService({ userId, newCartItem });
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

export const deleteCartItemController = async (req, res) => {
  try {
    const { cartId } = req.params;
    const userId = req.user.id;
    const response = await deleteCartItemService({ userId, cartId });
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
