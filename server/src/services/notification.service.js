import OutboxEvent from "../models/OutboxEvent.js";

export const createTierNotification = async ({
    member,
    oldTier,
    newTier
}) => {
    return OutboxEvent.create({
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
};