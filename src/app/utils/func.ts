// app/utils/func.ts

export function isTimestampExpired(timestamp?: string | Date | null): boolean {
    if (!timestamp) return false;
    return new Date(timestamp).getTime() < Date.now();
}

export function formatDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "—";
  
  // Create a Date object safely
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  
  // If invalid date string, fall back gracefully
  if (isNaN(date.getTime())) return "—";

  // Using UTC methods prevents local browser offsets from shifting the day
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  return `${month} ${day}, ${year}`;
}