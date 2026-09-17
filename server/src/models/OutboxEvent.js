import mongoose from "mongoose";

const outboxEventSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true
        },

        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member",
            required: true
        },

        payload: {
            type: Object,
            required: true
        },

        processed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model(
    "OutboxEvent",
    outboxEventSchema
);