// src/lib/utils/date.ts

export function isTimestampExpired(timestamp?: string | Date | null): boolean {
    if (!timestamp) return false;
    return new Date(timestamp).getTime() < Date.now();
}