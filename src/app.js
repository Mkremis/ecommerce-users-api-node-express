import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRoutes from "./routes/auth.rutes.js";
import usersRoutes from "./routes/users.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import likesRoutes from "./routes/likes.routes.js";

import payRoutes from "./routes/payment.routes.js";
import purchasesRoutes from "./routes/purchases.routes.js";
import transactionsRoutes from "./routes/transactions.routes.js";
import corsMiddleware from "./config/cors.js";

const app = express();
app

  .use(cookieParser())
  // .use(express.urlencoded({ extended: false }))
  .use(morgan("dev"))
  .use(express.json())
  .use(corsMiddleware) // Usa el middleware de CORS aquí

  //public rutes
  .use("/auth", authRoutes)

  //private routes
  .use("/api/users", usersRoutes)
  .use("/api/users", cartRoutes)
  .use("/api/users", likesRoutes)

  .use("/api/users", payRoutes)
  .use("/api/users", transactionsRoutes)
  .use("/api/users", purchasesRoutes);

// .use(errorHandler);
export default app;
