import dbPromise from "../index.js";

export const updateCartService = async ({ userId, newCartItem }) => {
  try {
    const db = await dbPromise;
    let result;

    const existingCartItem = await db.getUserCartItem({
      userId,
      prodId: newCartItem.prodId,
    });

    if (existingCartItem) {
      const updatedProductQ = newCartItem.productQ;
      result = await db.updateUserCartItem({
        userId,
        prodId: newCartItem.prodId,
        productQ: updatedProductQ,
      });
    } else {
      result = await db.saveUserCartItem({ userId, cartItem: newCartItem });
    }

    if (result.success) {
      const updatedUserCart = await db.getCartByUserId({ userId });
      return updatedUserCart;
    }
  } catch (error) {
    console.error(error);
    throw new Error(`Error updating user cart: ${error.message}`);
  }
};

export const deleteCartItemService = async ({ userId, cartId }) => {
  try {
    const db = await dbPromise;
    const response = await db.deleteCartItem({ cartId });

    if (response.success) {
      const updatedUserCart = await db.getCartByUserId({ userId });
      return updatedUserCart;
    }
  } catch (error) {
    console.error(error);
    throw new Error({ fail: `Error deleting cart item: ${error.message}` });
  }
};
