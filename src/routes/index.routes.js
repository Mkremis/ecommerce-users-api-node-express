import { Router } from "express";
import { ping, tables, db } from "../controllers/index.controller.js";

const router = Router();
router.get("/ping", ping);
router.get("/tables", tables);
router.get("/db/:db", db);

export default router;
