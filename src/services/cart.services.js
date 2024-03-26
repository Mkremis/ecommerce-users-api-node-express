import dbPromise from "../index.js";

/**
 * Service to update user's cart.
 * @param {Object} params - Parameters for updating cart.
 * @param {string} params.userId - User ID.
 * @param {Object} params.newCartItem - New cart item data.
 * @returns {Object} Object with updated cart.
 */
export const updateCartService = async ({ userId, newCartItem }) => {
  try {
    const db = await dbPromise;
    let response;

    const existingCartItem = await db.getUserCartItem({
      userId,
      prodId: newCartItem.prodId,
    });

    if (existingCartItem) {
      const updatedProductQ = newCartItem.productQ;
      response = await db.updateUserCartItem({
        userId,
        prodId: newCartItem.prodId,
        productQ: updatedProductQ,
      });
    } else {
      response = await db.saveUserCartItem({ userId, cartItem: newCartItem });
    }

    if (response.success) {
      const updatedUserCart = await db.getCartByUserId({ userId });
      return { success: updatedUserCart };
    }
  } catch (error) {
    console.error(error);
    return { fail: `Error updating user cart: ${error.message}` };
  }
};

/**
 * Service to delete a cart item.
 * @param {Object} params - Parameters for deleting cart item.
 * @param {string} params.userId - User ID.
 * @param {string} params.cartId - Cart item ID to delete.
 * @returns {Object} Object with updated cart after deletion.
 */
export const deleteCartItemService = async ({ userId, cartId }) => {
  try {
    const db = await dbPromise;
    const response = await db.deleteCartItem({ cartId });

    if (response.success) {
      const updatedUserCart = await db.getCartByUserId({ userId });
      return { success: updatedUserCart };
    }
  } catch (error) {
    console.error(error);
    return { fail: `Error deleting cart item: ${error.message}` };
  }
};
