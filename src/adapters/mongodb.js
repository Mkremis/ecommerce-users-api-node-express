import mongoose from "mongoose";
import { MONGODB_URL } from "../config.js";

const userSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    title: String,
    first: String,
    last: String,
    email: { type: String, unique: true },
    phone: { type: String, unique: true },
    thumbnail: String,
    city: String,
    state: String,
    street_number: String,
    street: String,
    country: String,
    postcode: String,
    user_cart: Object,
    user_likes: Object,
  },
  {
    versionKey: false, // Esto evita que se incluya la propiedad __v en los resultados
  }
);

const User = mongoose.model("User", userSchema);

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

  async registerNewUser({ userData }) {
    try {
      const user = new User(userData);
      await user.save();
      return { success: "User created successfully" };
    } catch (error) {
      console.error(error);
      return { fail: error.message };
    }
  }

  async getUserByUsername({ username }) {
    try {
      const user = await User.findOne({ username });
      if (user) {
        return { success: user };
      } else {
        return { fail: "User not found" };
      }
    } catch (error) {
      console.error(error);
      return { fail: error.message };
    }
  }

  async getUserById({ id }) {
    try {
      const user = await User.findById(id);
      if (user) {
        return { success: user.toObject() };
      } else {
        return { fail: "User not found" };
      }
    } catch (error) {
      console.error(error);
      return { fail: error.message };
    }
  }

  async updateUserData({ userData, id }) {
    try {
      const user = await User.findByIdAndUpdate(id, userData, { new: true });
      if (user) {
        return { success: user };
      } else {
        return { fail: "User not found" };
      }
    } catch (error) {
      console.error(error);
      return { fail: error.message };
    }
  }

  async getUserCart({ username, id = null }) {
    try {
      if (!id) id = await this.getUserId({ username });
      const user = id
        ? await User.findById(id)
        : await User.findOne({ username });
      if (user && user.user_cart) {
        const cart = JSON.parse(user.user_cart);
        console.log(cart);

        return { success: { user_cart: cart } };
      } else {
        return { success: { user_cart: {} } };
      }
    } catch (error) {
      console.error(error);
      return { fail: error.message };
    }
  }

  async updateUserCart({ username, cart }) {
    try {
      const user = await User.findOneAndUpdate(
        { username },
        { user_cart: cart },
        { new: true }
      );
      if (user) {
        return { success: user.user_cart };
      } else {
        return { fail: "User not found" };
      }
    } catch (error) {
      console.error(error);
      return { fail: error.message };
    }
  }

  async getUserLikes({ username, id = null }) {
    console.log(username, id);
    try {
      if (!id) id = await this.getUserId({ username });
      const user = id
        ? await User.findById(id)
        : await User.findOne({ username });

      if (user && user.user_likes) {
        const likes = JSON.parse(user.user_likes).likes;
        return { success: likes };
      } else {
        return { success: [] };
      }
    } catch (error) {
      console.error(error);
      return { fail: error.message };
    }
  }

  async updateUserLikes({ username, likes }) {
    try {
      const user = await User.findOneAndUpdate(
        { username },
        { user_likes: likes },
        { new: true }
      );
      if (user) {
        return { success: user.user_likes };
      } else {
        return { fail: "User not found" };
      }
    } catch (error) {
      console.error(error);
      return { fail: error.message };
    }
  }
  async getUserId({ username }) {
    try {
      const user = await User.findOne({ username });

      if (user) {
        return user._id;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      throw error; // Puedes manejar este error en el controlador
    }
  }
}

export default MongoDBAdapter;
