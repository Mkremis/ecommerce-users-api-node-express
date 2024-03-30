import express from "express";
import cors from "cors";
import { corsOptions } from "./config/corsOptions.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRoutes from "./routes/auth.rutes.js";
import usersRoutes from "./routes/users.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import likesRoutes from "./routes/likes.routes.js";

import payRoutes from "./routes/payment.routes.js";
// import orderRoutes from "./routes/orders.routes.js";

const app = express();
app
  .use(cors(corsOptions))
  .use(cookieParser())
  // .use(express.urlencoded({ extended: false }))
  .use(morgan("dev"))
  .use(express.json())

  //public rutes
  .use("/auth", authRoutes)

  //private routes
  .use("/api/users", usersRoutes)
  .use("/api/users", cartRoutes)
  .use("/api/users", likesRoutes)

  .use("/api/users", payRoutes);
// .use('/api/users', orderRoutes)

// .use(errorHandler);
export default app;
