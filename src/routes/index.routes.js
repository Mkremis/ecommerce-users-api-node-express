import { Router } from "express";
import { ping, tables, db } from "../controllers/index.controller.js";
import { handleRefreshToken } from "../controllers/refreshToken.controller.js";

const router = Router();
router.post("/refresh", handleRefreshToken)
router.get("/ping", ping);
router.get("/tables", tables);
router.get("/db/:db", db);

export default router;
