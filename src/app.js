import express from "express";
import cors from "cors";
import morgan from "morgan";

import usersRoutes from "./routes/users.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import indexRoutes from "./routes/index.routes.js";
import payRoutes from "./routes/payment.routes.js";
import orderRoutes from "./routes/orders.routes.js";
import likesRoutes from "./routes/likes.routes.js";
import { logger } from "./middlewares/logEvents.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import { credentials } from "./middlewares/credentials.js";
import { handleRefreshToken } from "./controllers/refreshToken.controller.js";
import { allowedOrigins } from "./config/allowedOrigins.js";

const app = express();

// Configurar opciones del CORS

app
  .use(cookieParser())
  .use(express.json())
  // Handle options credentials check - before CORS!
  // and fetch cookies credentials requirement
  .use(credentials)
  .use(cors({origin:allowedOrigins}))
  .use(morgan("dev"))
  // .use(logger)
  
  .get("/", (req, res) => res.send("<h1>ecommerce api</h1>"))
  // Ruta para el refresco del token
  .get("/refresh-token", handleRefreshToken)
  .use(indexRoutes)
  .use("/api", usersRoutes)
  .use("/api", cartRoutes)
  .use("/api", payRoutes)
  .use("/api", orderRoutes)
  .use("/api", likesRoutes);
// .all("*", (req, res) => res.status(404))
// .use(errorHandler);
export default app;
