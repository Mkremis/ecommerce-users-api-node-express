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

const app = express();
const whiteList = ["https://mkremis.github.io/ecommerce-react/"];
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};
app
  .use(logger)
  .use(cors(corsOptions))
  .use(morgan("dev"))
  .use(express.json())

  .get("/", (req, res) => res.send("<h1>ecommerce api</h1>"))
  .use(indexRoutes)
  .use("/api", usersRoutes)
  .use("/api", cartRoutes)
  .use("/api", payRoutes)
  .use("/api", orderRoutes)
  .use("/api", likesRoutes)
  .use((req, res, next) =>
    res.status(404).json({ message: "endpoint not found" })
  );
export default app;
