import { Router } from "express";
import { ping, tables, users } from "../controllers/index.controller.js";

const router = Router();
router.get("/ping", ping);
router.get("/tables", tables);
router.get("/users", users);

export default router;
