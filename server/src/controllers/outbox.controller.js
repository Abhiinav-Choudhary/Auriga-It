import OutboxEvent from "../models/OutboxEvent.js";

export const getOutbox = async (req, res) => {
    try {
        const events = await OutboxEvent.find()
            .sort({ createdAt: -1 });

        res.json({
            events
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};