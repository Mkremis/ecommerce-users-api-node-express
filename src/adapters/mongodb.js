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
    userId: { type: Schema.Types.ObjectId, required: true },
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
  userId: { type: Schema.Types.ObjectId, required: true },
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
  userId: { type: Schema.Types.ObjectId, required: true },
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

  async getUserDataById({ userId }) {
    try {
      const userData = await UserDashboard.findOne({ userId });
      return { success: userData };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateUserData({ userData, userId }) {
    console.log(userData);
    const filter = { userId };
    let success = false;
    try {
      const updatedDashboard = await UserDashboard.findOneAndUpdate(
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
        const newDashboard = new UserDashboard({ ...userData, userId });
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
      const userCart = await Cart.findOne({ userId });
      return userCart?.products || [];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateUserCart({ userId, newCartItem }) {
    try {
      const userFound = await Cart.findOne({ userId });

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
        const newUser = new Cart({ userId, products: [newCartItem] });
        await newUser.save();
      }
      return userFound.products; // Devolver el objeto actualizado
    } catch (error) {
      console.error(error);
      throw error; // Re-lanzar error para que sea manejado por createLikeService
    }
  }

  async deleteCartItem({ userId, cartId }) {
    try {
      const userCart = await Cart.findOne({ userId });
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
  //like services
  async getLikesByUserId({ userId }) {
    try {
      const userLikes = await Likes.findOne({ userId });
      return userLikes?.likes || [];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async saveUserLike({ userId, newLike }) {
    try {
      const userFound = await Likes.findOne({ userId });
      if (userFound) {
        userFound.likes.push(newLike);
        await userFound.save();
        return { success: true };
      } else {
        const newUser = new Likes({ userId, likes: [newLike] });
        await newUser.save();
        return { success: true };
      }
    } catch (error) {
      console.error(error);
      throw error; // Re-lanzar error para que sea manejado por createLikeService
    }
  }

  async deleteUserLikeByProdId({ userId, prodId }) {
    const filter = { userId };
    const update = { $pull: { likes: { prodId: prodId } } };
    try {
      const deletedLike = await Likes.findOneAndUpdate(filter, update, {
        new: true,
      });
      if (deletedLike) return { success: deletedLike };
    } catch (error) {
      console.error(error);
      throw error; // Re-lanzar error para que sea manejado por el código que llama a esta función
    }
  }
}

export default MongoDBAdapter;
