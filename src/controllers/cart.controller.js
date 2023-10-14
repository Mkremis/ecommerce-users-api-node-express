import dbPromise from "../index.js";

export const getCart = async (req, res) => {
  const db = await dbPromise;
  const { username } = req.params;
  try {
    const response = await db.getUserCart({ username });
    if (response.success) res.status(200).json(response.success);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

export const updateCart = async (req, res) => {
  const db = await dbPromise;
  const { username } = req.params;
  const cart = JSON.stringify(req.body);
  try {
    const response = await db.updateUserCart({ username, cart });
    if (response.success)
      res.status(200).json({ message: "Cart updated successfully" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
