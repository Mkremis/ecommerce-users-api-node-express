import express from "express";
const cors = require("cors");

import usersRoutes from "./routes/users.routes.js";
import indexRoutes from "./routes/index.routes.js";

const app = express();

app
  .use(cors())
  .get("/", (req, res) => res.send("<h1>Home</h1>"))
  .use(express.json())
  .use(indexRoutes)
  .use("/api", usersRoutes)
  .use((req, res, next) =>
    res.status(404).json({ message: "endpoint not found" })
  );
export default app;
