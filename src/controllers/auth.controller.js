import dbPromise from "../index.js";
import { encrypt, verify } from "../utils/bcryptHandle.js";
import { accessJWT } from "../utils/jwtHandle.js";

export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!req?.user?.id) {
      return res
        .status(404)
        .json({ message: [`Not user found with username ${username}`] });
    }

    const passwordHash = req.user.password;
    const isCorrect = await verify(password, passwordHash);
    if (!isCorrect) {
      return res.status(401).json({ message: ["Incorrect credentials"] });
    }
    const { id, email } = req.user;
    const jwt = accessJWT({ id });

    res.cookie("jwt", jwt, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: true,
      sameSite: "none",
    });
    const db = await dbPromise;
    const userData = { userName, email };
    const userLikes = await db.getUserLikes({ userName, id });
    const userCart = await db.getUserCart({ userName, id });
    res.status(200).json({ userData, userLikes, userCart });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error });
  }
};

export const register = async (req, res) => {
  try {
    if (req?.user?.id) {
      // Ya hay un usuario logueado
      return res
        .status(403)
        .json({ message: "Forbidden: User is already logged in" });
    }

    let userData = req.body;

    // Encripta la contraseña antes de guardarla
    userData.password = await encrypt(userData.password);
    const db = await dbPromise;

    // Intenta registrar al nuevo usuario en la base de datos
    const response = await db.registerNewUser({ userData });

    if (response.success) {
      // Usuario registrado exitosamente
      return res.sendStatus(204);
    } else {
      // Error al registrar al usuario
      return res.status(409).json({ message: response.fail });
    }
  } catch (error) {
    // Error interno del servidor
    console.error("Error en el registro:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
