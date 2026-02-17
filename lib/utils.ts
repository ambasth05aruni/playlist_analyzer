export interface FormattedDuration {
    hours: number;
    minutes: number;
    seconds: number;
}

export function formatDuration(totalSeconds: number): FormattedDuration {
    let seconds = totalSeconds;
    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    return { hours, minutes, seconds: Math.floor(seconds) };
}

export function formatDurationString(totalSeconds: number): string {
    const { hours, minutes, seconds } = formatDuration(totalSeconds);
    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
    return parts.join(" ");
}

export interface SpeedDurations {
    oneX: FormattedDuration;
    onePointTwoFiveX: FormattedDuration;
    onePointFiveX: FormattedDuration;
    onePointSevenFiveX: FormattedDuration;
    twoX: FormattedDuration;
}

export function formatDurationWithSpeeds(
    totalSeconds: number
): SpeedDurations {
    return {
        oneX: formatDuration(totalSeconds),
        onePointTwoFiveX: formatDuration(totalSeconds / 1.25),
        onePointFiveX: formatDuration(totalSeconds / 1.5),
        onePointSevenFiveX: formatDuration(totalSeconds / 1.75),
        twoX: formatDuration(totalSeconds / 2),
    };
}

// Extract playlist ID from URL or raw ID
export function extractPlaylistId(input: string): string | null {
    const trimmed = input.trim();

    // Extract from URL (handles youtube.com/playlist?list=... and other formats)
    const match = /[?&]list=([\w-]+)/.exec(trimmed);
    if (match) return match[1];

    // Already a raw playlist ID (PL, UU, OL, LL, or other prefixes)
    if (/^[\w-]{10,}$/.test(trimmed)) return trimmed;

    return null;
}

// Classname utility
export function cn(...classes: (string | false | undefined | null)[]): string {
    return classes.filter(Boolean).join(" ");
}
