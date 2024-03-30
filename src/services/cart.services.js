import dbPromise from "../index.js";

export const updateCartService = async ({ userId, newCartItem }) => {
  try {
    const db = await dbPromise;
    return await db.updateUserCart({
      userId,
      newCartItem,
    });
  } catch (error) {
    console.error(error);
    throw new Error(`Error updating user cart: ${error.message}`);
  }
};

export const deleteCartItemService = async ({ userId, cartId }) => {
  try {
    const db = await dbPromise;
    return await db.deleteCartItem({ userId, cartId });
  } catch (error) {
    console.error(error);
    throw new Error({ fail: `Error deleting cart item: ${error.message}` });
  }
};
