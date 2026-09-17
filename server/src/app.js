import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import memberRoutes from "./routes/member.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import outboxRoutes from "./routes/outbox.routes.js";
import clockRoutes from "./routes/clock.routes.js";

const app = express();

const allowedOrigin =
    "https://jubilant-potato-pjq45w9v5jx3676j-5173.app.github.dev";

console.log("Allowed CORS origin:", allowedOrigin);

app.use(
    cors({
        origin: allowedOrigin,
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
app.use("/outbox", outboxRoutes);
app.use("/clock", clockRoutes);

export default app;