import dbPromise from "../index.js";
import { encrypt, verify } from "../utils/bcryptHandle.js";
import { accessJWT } from "../utils/jwtHandle.js";

export const loginService = async ({ isUser, loginData }) => {
  try {
    if (!isUser) {
      return {
        fail: {
          isUser: "No user found with provided username",
        },
      };
    }

    const { id, email } = isUser;
    const { userName } = loginData;
    const passwordHash = isUser.password;
    const isCorrect = await verify(loginData.password, passwordHash);

    if (!isCorrect) {
      return { fail: { credentials: "Incorrect credentials" } };
    }

    const jwt = accessJWT({ id });
    const db = await dbPromise;
    const thumbnail = await db.getUserThumbnailById({ userId: id });

    const userData = {
      userName,
      email,
      ...thumbnail,
    };
    const userLikes = await db.getLikesByUserId({ userId: id });
    const userCart = await db.getCartByUserId({ userId: id });

    return { success: { login: { userData, userLikes, userCart }, jwt } };
  } catch (error) {
    console.error(error);
    return { fail: `Error during login: ${error.message}` };
  }
};

export const registerService = async ({ isUser, registerData }) => {
  try {
    if (isUser) {
      return { fail: { alreadyUser: true } };
    }

    registerData.password = await encrypt(registerData.password);
    const db = await dbPromise;

    const response = await db.registerNewUser({ registerData });

    return response;
  } catch (error) {
    console.error(error);
    return { fail: `Error during registration: ${error.message}` };
  }
};
