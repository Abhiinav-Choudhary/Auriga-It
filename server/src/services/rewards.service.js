const getTier = (totalSpend) => {
    if (totalSpend >= 10000) {
        return "Gold";
    }

    if (totalSpend >= 5000) {
        return "Silver";
    }

    return "Bronze";
};

const getMultiplier = (tier) => {
    if (tier === "Gold") return 1.5;
    if (tier === "Silver") return 1.25;

    return 1;
};

const calculatePoints = (amount, tier) => {
    const multiplier = getMultiplier(tier);

    return Math.floor((amount / 100) * multiplier);
};

export {
    getTier,
    getMultiplier,
    calculatePoints
};