import dbPromise from "../index.js";

export const userDashboardService = async ({ userId }) => {
  try {
    const db = await dbPromise;
    return await db.getUserDataById({ userId });
  } catch (error) {
    console.error(error);
    return { fail: `Error fetching user dashboard data: ${error.message}` };
  }
};

export const updateUserDashboardService = async ({ userData, userId }) => {
  try {
    const db = await dbPromise;
    const response = await db.updateUserData({ userData, userId });

    if (response.success) {
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: `Error updating user dashboard data: ${error.message}`,
    };
  }
};

export const reloadSessionService = async ({ userId }) => {
  try {
    const db = await dbPromise;
    const loginData = await db.getUserById({ userId });
    const userProfilePicture = await db.getUserThumbnailById({ userId });
    const userData = { ...loginData.success, ...userProfilePicture.success };
    const userLikes = await db.getLikesByUserId({ userId });
    const userCart = await db.getCartByUserId({ userId });
    return { success: { userData, userLikes, userCart } };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: `Error reloading the user data: ${error.message}`,
    };
  }
};
