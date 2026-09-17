import Member from "../models/Member.js";
import Transaction from "../models/Transaction.js";
import PointLedger from "../models/PointLedger.js";
import OutboxEvent from "../models/OutboxEvent.js";

import {
    getTier,
    calculatePoints
} from "../services/rewards.service.js";

const EXPIRY_DAYS = 90;

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

        // Store old tier before purchase
        const oldTier = member.tier;

        // Points are calculated using the tier BEFORE this purchase
        const earnedPoints = calculatePoints(
            amount,
            oldTier
        );

        // Update lifetime spend
        member.totalSpend += amount;

        // Calculate new tier after purchase
        const newTier = getTier(member.totalSpend);

        member.tier = newTier;

        // Add earned points to live balance
        member.points += earnedPoints;

        await member.save();

        // Create transaction record
        const transaction = await Transaction.create({
            member: member._id,
            type: "PURCHASE",
            amount,
            points: earnedPoints,
            description
        });

        // Create point ledger entry
        if (earnedPoints > 0) {
            const expiresAt = new Date();
            expiresAt.setDate(
                expiresAt.getDate() + EXPIRY_DAYS
            );

            await PointLedger.create({
                member: member._id,
                points: earnedPoints,
                remainingPoints: earnedPoints,
                source: "PURCHASE",
                expiresAt
            });
        }

        // Notify when member enters a new tier
        if (oldTier !== newTier) {
            await OutboxEvent.create({
                type: "TIER_UPGRADED",
                member: member._id,
                payload: {
                    memberId: member._id,
                    memberName: member.name,
                    phone: member.phone,
                    oldTier,
                    newTier,
                    message: `Congratulations ${member.name}! You have been upgraded from ${oldTier} to ${newTier}.`
                }
            });
        }

        res.status(201).json({
            message: "Purchase recorded successfully",
            transaction,
            member
        });

    } catch (error) {
        console.error("Purchase error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


export const redeem = async (req, res) => {
    try {
        const { memberId, points, description } = req.body;

        if (!points || points <= 0) {
            return res.status(400).json({
                message: "Invalid redemption points"
            });
        }

        const member = await Member.findById(memberId);

        if (!member) {
            return res.status(404).json({
                message: "Member not found"
            });
        }

        if (member.points < points) {
            return res.status(400).json({
                message: "Insufficient points"
            });
        }

        let remainingToRedeem = points;

        // Consume oldest points first (FIFO)
        const ledgers = await PointLedger.find({
            member: member._id,
            remainingPoints: { $gt: 0 },
            expiresAt: { $gt: new Date() }
        }).sort({
            expiresAt: 1
        });

        for (const ledger of ledgers) {
            if (remainingToRedeem <= 0) {
                break;
            }

            const usedPoints = Math.min(
                ledger.remainingPoints,
                remainingToRedeem
            );

            ledger.remainingPoints -= usedPoints;

            await ledger.save();

            remainingToRedeem -= usedPoints;
        }

        // Make sure ledger has enough usable points
        if (remainingToRedeem > 0) {
            return res.status(400).json({
                message: "Point ledger does not contain enough usable points"
            });
        }

        // Update live balance
        member.points -= points;

        await member.save();

        // Create redemption transaction
        const transaction = await Transaction.create({
            member: member._id,
            type: "REDEMPTION",
            amount: 0,
            points: -points,
            description
        });

        res.status(201).json({
            message: "Points redeemed successfully",
            transaction,
            member
        });

    } catch (error) {
        console.error("Redemption error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


export const getMemberTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({
            member: req.params.memberId
        }).sort({
            createdAt: -1
        });

        res.json({
            transactions
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};