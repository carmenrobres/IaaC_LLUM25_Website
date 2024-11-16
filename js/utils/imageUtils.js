// js/utils/imageUtils.js
export function parseTimeFromFilename(filename) {
    const match = filename.match(/(\d{2})-(\d{2})_(\d+)/);
    if (match) {
        const [, hours, minutes, day] = match;
        return {
            day: parseInt(day),
            hours: parseInt(hours),
            minutes: parseInt(minutes),
            timestamp: new Date(2024, 0, day, hours, minutes).getTime()
        };
    }
    return null;
}

export function createDisplayName(timeInfo, filename) {
    return timeInfo
        ? `Day ${timeInfo.day} - ${timeInfo.hours}:${String(timeInfo.minutes).padStart(2, '0')}`
        : filename;
}