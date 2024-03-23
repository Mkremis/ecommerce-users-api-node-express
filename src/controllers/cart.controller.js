import dbPromise from "../index.js";

export const updateCartItem = async (req, res) => {
  const db = await dbPromise;
  const { id } = req.user;
  const newCartItem = req.body;

  let response;
  try {
    // Verificar si ya existe un carro para este user_id y prodId
    const existingCartItem = await db.getUserCartItem({
      userId: id,
      prodId: newCartItem.prodId,
    });

    if (existingCartItem) {
      // Si existe, actualizar la cantidad (productQ)
      const updatedProductQ = newCartItem.productQ;
      response = await db.updateUserCartItem({
        userId: id,
        prodId: newCartItem.prodId,
        productQ: updatedProductQ,
      });
    } else {
      // Si no existe, guardar el carro completo para este user_id
      response = await db.saveUserCartItem({
        userId: id,
        cartItem: newCartItem,
      });
    }
    if (response.success) {
      const updatedUserCart = await db.getCartByUserId({ id });
      return res.status(200).json(updatedUserCart);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const db = await dbPromise;
    const { cartId } = req.params;
    const { id } = req.user;
    const response = await db.deleteCartItem({ cartId });
    if (response.success) {
      const updatedUserCart = await db.getCartByUserId({ id });
      return res.status(200).json(updatedUserCart);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
