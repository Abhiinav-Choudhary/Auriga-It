import express from "express";

import {
    purchase,
    redeem,
    getMemberTransactions
} from "../controllers/transaction.controller.js";



import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/purchase", purchase);

router.post("/redeem", redeem);

router.get(
    "/:memberId",
    getMemberTransactions
);

export default router;