import express from "express";
import { runClock } from "../controllers/clock.controller.js";

const router = express.Router();

router.post("/", runClock);

export default router;