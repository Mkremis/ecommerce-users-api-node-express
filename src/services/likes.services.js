import dbPromise from "../index.js";

export const getLikesService = async ({ userId }) => {
  const db = await dbPromise;

  try {
    const likes = await db.getLikesByUserId({ userId });
    return likes;
  } catch (error) {
    console.error(error);
    throw new Error("Error retrieving user likes");
  }
};

export const createLikeService = async ({ userId, newLike }) => {
  const db = await dbPromise;
  try {
    const saveResult = await db.saveUserLike({ userId, newLike });
    if (saveResult.success) {
      return { success: "User like created successfully" };
    } else {
      return { fail: "Error creating user like" };
    }
  } catch (error) {
    console.error(error);
    return { fail: "Internal Server Error" };
  }
};

export const deleteLikeService = async ({ userId, prodId }) => {
  const db = await dbPromise;

  try {
    const deleteResult = await db.deleteUserLikeByProdId({ userId, prodId });

    if (deleteResult.success) {
      return { success: true };
    } else {
      return { fail: true };
    }
  } catch (error) {
    console.error(error);
    return { fail: "Internal Server Error" };
  }
};
