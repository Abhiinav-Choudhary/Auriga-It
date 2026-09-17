import express from "express";

import {
    purchase,
    redeem
} from "../controllers/transaction.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/purchase", purchase);

router.post("/redeem", redeem);

export default router;