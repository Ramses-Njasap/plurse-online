import { CSSProperties } from "react";

type IconProps = {
    className?: string;
    style?: CSSProperties;
};

export function IconTrash({ className = "w-3.5 h-3.5", style }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
        </svg>
    );
}

export function IconClock({ className = "w-3.5 h-3.5", style }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3.5 2" />
        </svg>
    );
}

export function IconMaximize({ className = "w-3.5 h-3.5", style }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3" />
            <path d="M16 3h3a2 2 0 0 1 2 2v3" />
            <path d="M21 16v3a2 2 0 0 1-2 2h-3" />
            <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
        </svg>
    );
}

export function IconMinimize({ className = "w-3.5 h-3.5", style }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 3v3a2 2 0 0 1-2 2H4" />
            <path d="M21 9h-3a2 2 0 0 1-2-2V4" />
            <path d="M3 15h3a2 2 0 0 1 2 2v3" />
            <path d="M15 21v-3a2 2 0 0 1 2-2h3" />
        </svg>
    );
}

export function IconClose({ className = "w-4 h-4", style }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 6l12 12" />
            <path d="M18 6L6 18" />
        </svg>
    );
}

export function IconMapPin({ className = "w-3.5 h-3.5", style }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
        </svg>
    );
}

export function IconCalendar({ className = "w-3.5 h-3.5", style }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4.5" width="18" height="16" rx="2" />
            <path d="M3 9.5h18" />
            <path d="M8 2.5v4" />
            <path d="M16 2.5v4" />
        </svg>
    );
}

export function IconTag({ className = "w-3.5 h-3.5", style }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.5 2.5H5A2.5 2.5 0 0 0 2.5 5v7.5a2.5 2.5 0 0 0 .73 1.77l9.5 9.5a2.5 2.5 0 0 0 3.54 0l7.5-7.5a2.5 2.5 0 0 0 0-3.54l-9.5-9.5a2.5 2.5 0 0 0-1.77-.73Z" />
            <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
        </svg>
    );
}