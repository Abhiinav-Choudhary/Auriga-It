const getTier = (totalSpend) => {
    // KEEP YOUR EXISTING SILVER/GOLD RULES HERE.
    // Platinum is added according to the twist.

    if (totalSpend >= 5000) {
        return "Platinum";
    }

    if (totalSpend >= 10000) {
        return "Gold";
    }

    if (totalSpend >= 5000) {
        return "Silver";
    }

    return "Bronze";
};

const getMultiplier = (tier) => {
    switch (tier) {
        case "Platinum":
            return 0.3;

        // KEEP YOUR EXISTING RATES
        case "Gold":
            return 0.2;

        case "Silver":
            return 0.15;

        default:
            return 0.1;
    }
};

const calculatePoints = (amount, tier) => {
    return Math.floor(amount * getMultiplier(tier));
};

export {
    getTier,
    getMultiplier,
    calculatePoints
};