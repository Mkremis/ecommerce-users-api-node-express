import express from "express";
import cors from "cors";
import { corsOptions } from "./config/corsOptions.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import usersRoutes from "./routes/users.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import likesRoutes from "./routes/likes.routes.js";

// import payRoutes from "./routes/payment.routes.js";
// import orderRoutes from "./routes/orders.routes.js";

const app = express();
app
  .use(cors(corsOptions))
  .use(cookieParser())
  // .use(express.urlencoded({ extended: false }))
  .use(morgan("dev"))
  .use(express.json())

  .use("/api", usersRoutes)
  .use("/api", cartRoutes)
  .use("/api", likesRoutes);

// .use('/api', payRoutes)
// .use('/api', orderRoutes)

// .use(errorHandler);
export default app;
