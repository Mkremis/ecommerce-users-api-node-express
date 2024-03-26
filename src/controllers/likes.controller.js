import {
  getLikesService,
  createLikeService,
  deleteLikeService,
} from "../services/likes.services.js";

export const getLikesController = async (req, res) => {
  const userId = req.user.id;

  try {
    const likes = await getLikesService({ userId });
    res.status(200).json(likes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createLikeController = async (req, res) => {
  try {
    const userId = req.user.id;
    const newLike = req.body;

    const createLikeResponse = await createLikeService({ userId, newLike });

    if (createLikeResponse.success) {
      return res.status(200).json({ message: createLikeResponse.success });
    } else {
      return res.status(500).json({ message: "Error creating user like" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteLikeController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { prodId } = req.params;

    const deleteResult = await deleteLikeService({ userId, prodId });

    if (deleteResult.success) {
      return res.status(200).json({ message: "Like eliminado correctamente." });
    } else {
      return res
        .status(404)
        .json({ message: "No se encontró el like para eliminar." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar el like." });
  }
};
