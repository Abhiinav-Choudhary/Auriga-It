import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import memberRoutes from "./routes/member.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    })
);

app.use(express.json());

app.use(cookieParser());

app.get("/", (req, res) => {
    res.json({
        message: "Cafe Rewards API running"
    });
});

app.use("/api/auth", authRoutes);

app.use("/api/members", memberRoutes);

app.use("/api/transactions", transactionRoutes);

export default app;