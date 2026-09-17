import mongoose from "mongoose";

const pointLedgerSchema = new mongoose.Schema(
    {
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member",
            required: true,
            index: true
        },

        points: {
            type: Number,
            required: true
        },

        remainingPoints: {
            type: Number,
            required: true,
            min: 0
        },

        source: {
            type: String,
            enum: ["PURCHASE", "REDEMPTION", "EXPIRATION"],
            required: true
        },

        expiresAt: {
            type: Date,
            required: true,
            index: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("PointLedger", pointLedgerSchema);