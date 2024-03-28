import dbPromise from "../index.js";

export const getLikesService = async ({ userId }) => {
  const db = await dbPromise;

  try {
    const result = await db.getLikesByUserId({ userId });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Error retrieving user likes");
  }
};

export const createLikeService = async ({ userId, newLike }) => {
  const db = await dbPromise;
  try {
    const result = await db.saveUserLike({ userId, newLike });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating user like");
  }
};

export const deleteLikeService = async ({ userId, prodId }) => {
  const db = await dbPromise;

  try {
    const result = await db.deleteUserLikeByProdId({ userId, prodId });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting user like");
  }
};
