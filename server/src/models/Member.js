import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        points: {
            type: Number,
            default: 0,
            min: 0
        },

        tier: {
            type: String,
            enum: ["Bronze", "Silver", "Gold"],
            default: "Bronze"
        },

        totalSpend: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Member", memberSchema);