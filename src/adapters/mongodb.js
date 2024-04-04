import mongoose from "mongoose";
import { MONGODB_URL } from "../config.js";

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  password: String,
  email: { type: String, unique: true },
  roles: [String],
});
const User = mongoose.model("User", userSchema);

const usersDashSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, required: true, ref: "User" }, // Modificado: Cambiado userId a _id
    title: String,
    first: String,
    last: String,
    phone: { type: String, unique: true },
    thumbnail: String,
    city: String,
    state: String,
    streetNumber: String,
    street: String,
    country: String,
    postcode: String,
  },
  {
    versionKey: false, // Esto evita que se incluya la propiedad __v en los resultados
  }
);
const UserDashboard = mongoose.model("UserDashboard", usersDashSchema);

const cartSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true, ref: "User" }, // Modificado: Cambiado userId a _id
  products: [
    {
      prodId: { type: Number, required: true },
      prodName: { type: String, required: true },
      prodPrice: { type: Number, required: true },
      prodImage: { type: String, required: true },
      priceCurrency: { type: String, required: true },
      prodGender: { type: String, required: true },
      productQ: { type: Number, required: true },
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);

const likesSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true, ref: "User" }, // Modificado: Cambiado userId a _id
  likes: [
    {
      prodId: { type: Number, required: true },
      prodName: { type: String, required: true },
      prodPrice: { type: Number, required: true },
      prodImage: { type: String, required: true },
      priceCurrency: { type: String, required: true },
      prodGender: { type: String, required: true },
    },
  ],
});

const Likes = mongoose.model("Likes", likesSchema);

const purchaseSchema = new mongoose.Schema({
  _id: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  items: [
    {
      prodId: {
        type: Number,
        ref: "Product", // Referencia al modelo de productos
        required: true,
      },
      order_id: { type: Number, required: true, ref: "Transaction" },
      prodName: { type: String, required: true },
      prodPrice: { type: Number, required: true },
      prodImage: { type: String, required: true },
      prodGender: { type: String, required: true },
      productQ: { type: Number, required: true },
    },
  ],
});

const Purchase = mongoose.model("Purchase", purchaseSchema);

const transactionSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  transaction_date: { type: Date, required: true },
  payment_method: { type: String, required: true },
  total_paid_amount: { type: Number, required: true },
  shipping_amount: { type: Number, required: true },
  card_number: { type: String, required: true },
  order_type: { type: String, required: true },
  currency_id: { type: String, required: true },
});
const Transaction = mongoose.model("Transaction", transactionSchema);

class MongoDBAdapter {
  constructor() {
    mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "MongoDB connection error:"));
    db.once("open", () => {
      console.log("Connected to MongoDB");
    });
  }
  //user services
  async registerNewUser({ registerData }) {
    try {
      const newUser = new User(registerData);
      await newUser.save();
      return { success: "User created successfully" };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async getUserByUsername({ userName }) {
    try {
      const foundUser = await User.findOne({ userName });
      return foundUser ? { success: foundUser } : { fail: "User not found" };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async getUserById({ userId }) {
    try {
      const foundUser = await User.findById(userId);
      return foundUser ? { success: foundUser } : { fail: "User not found" };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async getUserDataById({ userId }) {
    try {
      const userData = await UserDashboard.findById(userId);
      return userData ? { success: userData } : { success: {} };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateUserData({ userData, userId }) {
    const filter = { _id: userId };
    let success = false;
    try {
      const updatedDashboard = await UserDashboard.findByIdAndUpdate(
        filter,
        userData,
        { new: true }
      );

      // Si userData contiene un nuevo password, actualizarlo
      if (userData.password) {
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { password: userData.password },
          { new: true }
        );
        success = updatedUser.password === userData.password;
      }

      if (updatedDashboard) {
        success = true;
      } else {
        const newDashboard = new UserDashboard({ ...userData, _id: userId });
        await newDashboard.save();
        success = true;
      }

      return { success };
    } catch (error) {
      console.error(error);
      return { fail: error.message };
    }
  }

  //cart services
  async getCartByUserId({ userId }) {
    try {
      const userCart = await Cart.findById(userId);
      return userCart?.products || [];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async updateUserCart({ userId, newCartItem }) {
    try {
      const userFound = await Cart.findById(userId);

      if (userFound) {
        const { prodId, productQ } = newCartItem;
        const productFound = userFound.products.findIndex(
          (product) => product.prodId === prodId
        );
        productFound >= 0
          ? (userFound.products[productFound].productQ = productQ)
          : userFound.products.push(newCartItem);

        await userFound.save();
      } else {
        const newUser = new Cart({ _id: userId, products: [newCartItem] });
        await newUser.save();
        return newUser.products;
      }
      return userFound.products; // Devolver el objeto actualizado
    } catch (error) {
      console.error(error);
      throw error; // Re-lanzar error para que sea manejado por createLikeService
    }
  }
  async deleteCartItem({ userId, cartId }) {
    try {
      const userCart = await Cart.findById(userId);
      if (userCart) {
        // Filtrar los productos para eliminar el que coincida con cartId
        userCart.products = userCart.products.filter(
          ({ _id }) => _id.toString() !== cartId
        );
        // Guardar el carrito actualizado
        await userCart.save();
        return userCart.products;
      } else {
        return { success: false, message: "User cart not found." };
      }
    } catch (error) {
      console.error("Error deleting item from cart:", error);
      throw error;
    }
  }
  async deleteCart({ userId }) {
    try {
      await Cart.findOneAndDelete(userId);
      return { success: "Cart deleted successfully" };
    } catch (error) {
      console.error("Error deleting cart:", error);
      throw error;
    }
  }

  //like services
  async getLikesByUserId({ userId }) {
    try {
      const userLikes = await Likes.findById(userId);
      return userLikes?.likes || [];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async saveUserLike({ userId, newLike }) {
    try {
      const userFound = await Likes.findById(userId);
      if (userFound) {
        userFound.likes.push(newLike);
        await userFound.save();
        return { success: true };
      } else {
        const newUserLikes = new Likes({ _id: userId, likes: [newLike] });
        await newUserLikes.save();
        return { success: true };
      }
    } catch (error) {
      console.error(error);
      throw error; // Re-lanzar error para que sea manejado por createLikeService
    }
  }
  async deleteUserLikeByProdId({ userId, prodId }) {
    const update = { $pull: { likes: { prodId: prodId } } };
    try {
      const deletedLike = await Likes.findByIdAndUpdate(userId, update, {
        new: true,
      });
      if (deletedLike) return { success: deletedLike };
    } catch (error) {
      console.error(error);
      throw error; // Re-lanzar error para que sea manejado por el código que llama a esta función
    }
  }

  //purchases services
  async createPurchase({ userId, purchasedItems }) {
    try {
      // Busca la compra del usuario por su ID
      const userPurchase = await Purchase.findById(userId);

      if (userPurchase) {
        // Si el usuario ya tiene una compra, agrega los nuevos items al array
        userPurchase.items.push(...purchasedItems);
        await userPurchase.save();
      } else {
        // Si el usuario no tiene compras registradas, crea una nueva compra
        const newPurchase = new Purchase({
          _id: userId,
          items: purchasedItems,
        });
        await newPurchase.save();
      }

      return { success: true };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async getPurchasesByUserId({ userId }) {
    try {
      const userPurchases = await Purchase.findById(userId);
      return userPurchases?.items || [];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async getPuchasesByTrId({ transactionId }) {
    try {
      const purchases = await Purchase.find({
        "items.order_id": transactionId,
      });
      return purchases.length ? purchases[0]["items"] : [];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  //transactions services
  async createTransaction({ transactionData }) {
    try {
      const newTransaction = new Transaction(transactionData);
      await newTransaction.save();
      return { success: true };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async getTransactionById({ transactionId }) {
    try {
      const transaction = await Transaction.findById(transactionId);
      return transaction
        ? { success: transaction }
        : { fail: "Transaction not found" };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default MongoDBAdapter;
