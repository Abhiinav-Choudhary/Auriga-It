import Member from "../models/Member.js";
import PointLedger from "../models/PointLedger.js";
import Transaction from "../models/Transaction.js";

export const expirePoints = async (now = new Date()) => {
    const staleEntries = await PointLedger.find({
        remainingPoints: { $gt: 0 },
        expiresAt: { $lte: now }
    });

    let expiredCount = 0;

    for (const entry of staleEntries) {
        const pointsToExpire = entry.remainingPoints;

        if (pointsToExpire <= 0) continue;

        const member = await Member.findById(entry.member);

        if (!member) continue;

        member.points = Math.max(
            0,
            member.points - pointsToExpire
        );

        await member.save();

        await Transaction.create({
            member: member._id,
            type: "REDEMPTION",
            points: -pointsToExpire,
            amount: 0,
            description: "Points expired after 90 days"
        });

        entry.remainingPoints = 0;
        entry.source = "EXPIRATION";

        await entry.save();

        expiredCount++;
    }

    return {
        expiredEntries: expiredCount
    };
};