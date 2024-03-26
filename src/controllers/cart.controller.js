import {
  deleteCartItemService,
  updateCartService,
} from "../services/cart.services.js";

/**
 * Controller to update user's cart.
 * @param {Request} req - HTTP request object.
 * @param {Response} res - HTTP response object.
 * @returns {Response} HTTP response with updated cart.
 */
export const updateCartController = async (req, res) => {
  try {
    const userId = req?.user?.id;
    const newCartItem = req.body;

    const updateCartResponse = await updateCartService({ userId, newCartItem });

    if (updateCartResponse.success) {
      return res.status(200).json(updateCartResponse.success);
    }

    return res.status(500).json({ error: "Failed to update cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Controller to delete a cart item.
 * @param {Request} req - HTTP request object.
 * @param {Response} res - HTTP response object.
 * @returns {Response} HTTP response with updated cart after deletion.
 */
export const deleteCartItemController = async (req, res) => {
  try {
    const { cartId } = req.params;
    const userId = req.user.id;

    const deleteCartResponse = await deleteCartItemService({ userId, cartId });

    if (deleteCartResponse.success) {
      return res.status(200).json(deleteCartResponse.success);
    }

    return res.status(500).json({ error: "Failed to delete cart item" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
