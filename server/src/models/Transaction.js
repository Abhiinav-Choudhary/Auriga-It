import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member",
            required: true
        },

        type: {
            type: String,
            enum: ["PURCHASE", "REDEMPTION"],
            required: true
        },

        amount: {
            type: Number,
            default: 0
        },

        points: {
            type: Number,
            required: true
        },

        description: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Transaction", transactionSchema);