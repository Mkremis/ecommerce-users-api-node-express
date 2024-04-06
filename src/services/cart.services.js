import db from "../index.js";

export const updateCartService = async ({ userId, newCartItem }) => {
  try {
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
    return await db.deleteCartItem({ userId, cartId });
  } catch (error) {
    console.error(error);
    throw new Error({ fail: `Error deleting cart item: ${error.message}` });
  }
};

export const deleteCartService = async ({ userId }) => {
  try {
    return await db.deleteUserCart({ userId });
  } catch (error) {
    console.error(error);
    throw new Error({ fail: `Error deleting cart item: ${error.message}` });
  }
};
