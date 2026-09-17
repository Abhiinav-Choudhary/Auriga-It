import express from "express";

import {
    purchase,
    redeem
} from "../controllers/transaction.controller.js";

const router = express.Router();

router.post("/purchase", purchase);
router.post("/redeem", redeem);

export default router;