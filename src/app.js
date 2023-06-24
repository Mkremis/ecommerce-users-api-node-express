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

const app = express();
// Configurar opciones del CORS
const corsOptions = {
  origin: "https://mkremis.github.io",
  optionsSuccessStatus: 200, // Algunos navegadores pueden requerir este código de estado para permitir las respuestas.
};
app
  .use(morgan("dev"))
  .use(logger)
  .use(cors(corsOptions))
  .use(express.json())
  .get("/", (req, res) => res.send("<h1>ecommerce api</h1>"))
  .use(indexRoutes)
  .use("/api", usersRoutes)
  .use("/api", cartRoutes)
  .use("/api", payRoutes)
  .use("/api", orderRoutes)
  .use("/api", likesRoutes)
  .all("*", (req, res) => res.status(404))
  .use(errorHandler);
export default app;
