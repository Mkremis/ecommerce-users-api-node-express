import dbPromise from "../index.js";

export const getLikes = async (req, res) => {
  const { id } = req.user;
  const db = await dbPromise;
  try {
    const response = await db.getUserLikes({ id });
    res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const createLike = async (req, res) => {
  const { id } = req.user;
  const newLike = req.body;
  const db = await dbPromise;
  try {
    const response = await db.createUserLike({ id, newLike });
    if (response.success)
      res.status(200).json({ message: "Likes updated successfully" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const deleteLike = async (req, res) => {
  const { id } = req.user;
  const { prodId } = req.params;
  console.log(req.params);
  const db = await dbPromise;

  try {
    const deleteResult = await db.deleteUserLikeByProdId({ id, prodId });

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
