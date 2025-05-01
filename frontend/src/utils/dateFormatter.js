export const formatDeckDate = (updatedAt) => {
    const currentDate = new Date();
    const updatedAtDate = new Date(updatedAt);

    const timeDiffInSeconds = Math.floor(currentDate - updatedAtDate) / 1000;
    const timeDiffInMinutes = Math.floor(timeDiffInSeconds / 60);
    const timeDiffInHours = Math.floor(timeDiffInMinutes / 60);
    const timeDiffInDays = Math.floor(timeDiffInHours / 24);
    const timeDiffInWeeks = Math.floor(timeDiffInDays / 7);

    if (timeDiffInWeeks > 5) {
        return updatedAtDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    } else if (timeDiffInDays > 7) {
        return `${timeDiffInWeeks}w ago`;
    } else if (timeDiffInDays > 1) {
        return `${timeDiffInDays}d ago`;
    } else if (timeDiffInHours >= 1) {
        return `${timeDiffInHours}h ago`;
    } else if (timeDiffInMinutes >= 1) {
        return `${timeDiffInMinutes}m ago`;
    } else {
        return "Just now";
    }
};

export const isToday = (date) => {
    const today = new Date();
    const dateToCheck = new Date(date);

    return (
        dateToCheck.getUTCFullYear() === today.getUTCFullYear() &&
        dateToCheck.getUTCMonth() === today.getUTCMonth() &&
        dateToCheck.getUTCDate() === today.getUTCDate()
    );
};
