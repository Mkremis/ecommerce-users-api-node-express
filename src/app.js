import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from 'path'
import usersRoutes from "./routes/users.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import indexRoutes from "./routes/index.routes.js";
import payRoutes from "./routes/payment.routes.js";


const app = express();

app
  .use(cors())
  .use(morgan('dev'))
  .use(express.json())
  .use(express.static(path.resolve('scr/public')))
  .get("/", (req, res) => res.send("<h1>Home</h1>"))
  .use(indexRoutes)
  .use("/api", usersRoutes)
  .use("/api", cartRoutes)
  .use("/api", payRoutes)
  .use((req, res, next) =>
    res.status(404).json({ message: "endpoint not found" })
  );
export default app;
