import dbPromise from "../index.js";

export const userDashboardService = async ({ userId }) => {
  try {
    const db = await dbPromise;
    const response = await db.getUserDataById({ userId });
    console.log(response);
    return response?.success;
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

export const reloadSessionService = async ({ userLoginData }) => {
  try {
    const db = await dbPromise;
    const { id: userId, email, userName } = userLoginData;
    const thumbnail = await db.getUserThumbnailById({ userId });
    const userData = { userName, email, ...thumbnail };
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
