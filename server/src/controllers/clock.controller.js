import { expirePoints } from "../services/expiration.service.js";

export const runClock = async (req, res) => {
    try {
        const now = req.body.now
            ? new Date(req.body.now)
            : new Date();

        if (Number.isNaN(now.getTime())) {
            return res.status(400).json({
                message: "Invalid date"
            });
        }

        const result = await expirePoints(now);

        res.json({
            message: "Clock processed",
            now,
            ...result
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};