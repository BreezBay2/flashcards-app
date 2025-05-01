export const calculateInterval = (reviewCount, interval, easeFactor) => {
    if (reviewCount === 0) {
        return 1;
    } else if (reviewCount === 1) {
        return 3;
    } else if (reviewCount === 2) {
        return 5;
    } else {
        const newInterval = applyFuzz(Math.floor(interval * easeFactor));

        if (newInterval > 365) {
            return 365;
        }

        return newInterval;
    }
};

export const calculateEaseFactor = (reviewCount, easeFactor, quality) => {
    if (reviewCount <= 2) {
        return easeFactor;
    } else {
        const newEaseFactor =
            easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

        if (newEaseFactor < 1.3) {
            return 1.3;
        }

        return newEaseFactor;
    }
};

const applyFuzz = (interval) => {
    const fuzzFactor = 0.05 + Math.random() * 0.1;
    const upOrDown = Math.random() < 0.5 ? -1 : 1;
    console.log(interval * fuzzFactor * upOrDown);
    return Math.round(interval + interval * fuzzFactor * upOrDown);
};
