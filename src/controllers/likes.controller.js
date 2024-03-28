import Message from "../schemas/Message.js";
import {
  getLikesService,
  createLikeService,
  deleteLikeService,
} from "../services/likes.services.js";

export const getLikesController = async (req, res) => {
  const userId = req.user.id;

  try {
    const response = await getLikesService({ userId });
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.setStatus(500);
  }
};

export const createLikeController = async (req, res) => {
  try {
    const userId = req.user.id;
    const newLike = req.body;

    const response = await createLikeService({ userId, newLike });

    if (response.success) {
      return res
        .status(200)
        .json(new Message("success", "User like created successfully"));
    } else {
      return res
        .status(500)
        .json(new Message("fail", "Error creating user like"));
    }
  } catch (error) {
    console.error(error);
    res.setStatus(500);
  }
};

export const deleteLikeController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { prodId } = req.params;

    const response = await deleteLikeService({ userId, prodId });

    if (response.success) {
      return res
        .status(200)
        .json(new Message("success", "Like eliminado correctamente."));
    } else {
      return res
        .status(404)
        .json({ message: "No se encontró el like para eliminar." });
    }
  } catch (error) {
    console.error(error);
    res.setStatus(500);
  }
};
