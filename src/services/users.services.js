import db from "../index.js";

export const getUserDashboardService = async ({ userId }) => {
  try {
    const response = await db.getUserDataById({ userId });
    return response;
  } catch (error) {
    console.error(error);
    return { fail: `Error fetching user dashboard data: ${error.message}` };
  }
};

export const updateUserDashboardService = async ({ userData, userId }) => {
  try {
    const response = await db.updateUserData({ userData, userId });
    return response;
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
    const loginData = await db.getUserById({ userId });
    const userDashboard = await db.getUserDataById({ userId });
    const userLikes = await db.getLikesByUserId({ userId });
    const userCart = await db.getCartByUserId({ userId });
    const thumbnail = userDashboard?.success?.thumbnail || "";
    const { email } = loginData?.success;
    const userName =
      loginData?.success?.userName || loginData?.success?.user_name;
    const userData = { userName, email, thumbnail };
    return { success: { userData, userLikes, userCart } };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: `Error reloading the user data: ${error.message}`,
    };
  }
};
