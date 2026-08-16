/* ── Password strength helpers ── */

export function passwordStrength(pw: string): number {
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
}

export function strengthLabel(score: number): { label: string; color: string } {
    if (score <= 1) return { label: "Weak", color: "text-red-400" };
    if (score === 2) return { label: "Fair", color: "text-amber-400" };
    if (score === 3) return { label: "Good", color: "text-green-500" };
    return { label: "Strong", color: "text-green-600" };
}

export function strengthBarColor(score: number): string {
    if (score <= 1) return "bg-red-400";
    if (score === 2) return "bg-amber-400";
    return "bg-green-500";
}