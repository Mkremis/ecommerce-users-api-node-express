import { Router } from "express";
import { ping, tables, db, newDB } from "../controllers/index.controller.js";

const router = Router();
router.get("/", (req, res) => {
  console.log(process.env);
  res.send("<h1>eCommerce Server</h1>");
});
router.get("/ping", ping);
router.get("/createdb", newDB);
router.get("/tables", tables);
router.get("/db/:db", db);

export default router;
