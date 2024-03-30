import db from "../index.js";

export const getLikesService = async ({ userId }) => {
  try {
    const result = await db.getLikesByUserId({ userId });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Error retrieving user likes");
  }
};

export const createLikeService = async ({ userId, newLike }) => {
  try {
    const result = await db.saveUserLike({ userId, newLike });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating user like");
  }
};

export const deleteLikeService = async ({ userId, prodId }) => {
  try {
    const result = await db.deleteUserLikeByProdId({ userId, prodId });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting user like");
  }
};
