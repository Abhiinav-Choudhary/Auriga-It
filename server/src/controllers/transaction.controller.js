import Member from "../models/Member.js";
import Transaction from "../models/Transaction.js";

import {
    getTier,
    calculatePoints
} from "../services/rewards.service.js";

export const purchase = async (req, res) => {
    try {
        const { memberId, amount, description } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                message: "Invalid purchase amount"
            });
        }

        const member = await Member.findById(memberId);

        if (!member) {
            return res.status(404).json({
                message: "Member not found"
            });
        }

        // Calculate points using current tier
        const earnedPoints = calculatePoints(
            amount,
            member.tier
        );

        // Update total spend
        member.totalSpend += amount;

        // Recalculate tier after purchase
        member.tier = getTier(member.totalSpend);

        // Add points
        member.points += earnedPoints;

        await member.save();

        const transaction = await Transaction.create({
            member: member._id,
            type: "PURCHASE",
            amount,
            points: earnedPoints,
            description
        });

        res.status(201).json({
            message: "Purchase recorded successfully",
            transaction,
            member
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};