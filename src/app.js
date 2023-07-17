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
import { corsOptions } from "./config/corsOptions.js";

const app = express();
app

  .use(cookieParser())
  // Handle options credentials check - before CORS!
  // and fetch cookies credentials requirement
  .use((req, res, next) => {
    console.log(req.cookies);
    next();
  })
  .use(credentials)
  .use(cors(corsOptions));

app
  .use(express.urlencoded({ extended: false }))
  .use(morgan("dev"))
  .use(express.json())

  .use(indexRoutes)
  .use("/api", usersRoutes)
  .use("/api", cartRoutes)
  .use("/api", payRoutes)
  .use("/api", orderRoutes)
  .use("/api", likesRoutes);

// .use(errorHandler);
export default app;
