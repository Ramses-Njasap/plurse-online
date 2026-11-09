// src/components/dashboard/my/settings/businesses/BusinessIcons.tsx

import type { CSSProperties } from "react";

interface IconProps { size?: number; className?: string; style?: CSSProperties }

function Svg({ size = 14, className, style, strokeWidth = 1.75, children }: IconProps & { strokeWidth?: number; children: React.ReactNode }) {
    return (
        <svg
            width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
            className={className} style={{ flexShrink: 0, ...style }}
            aria-hidden="true"
        >
            {children}
        </svg>
    );
}

export const PinIcon = (p: IconProps) => <Svg {...p}><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></Svg>;
export const LockIcon = (p: IconProps) => <Svg {...p}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></Svg>;
export const ChevronRightIcon = (p: IconProps) => <Svg {...p} strokeWidth={2.25}><path d="m9 6 6 6-6 6" /></Svg>;
export const PencilIcon = (p: IconProps) => <Svg {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" /></Svg>;
export const CloseIcon = (p: IconProps) => <Svg {...p} strokeWidth={2.25}><path d="M18 6 6 18M6 6l12 12" /></Svg>;
export const KeyIcon = (p: IconProps) => <Svg {...p}><circle cx="7.5" cy="15.5" r="4.5" /><path d="m10.7 12.3 9.8-9.8M16 7l3 3M14 9l2 2" /></Svg>;
export const UserIcon = (p: IconProps) => <Svg {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></Svg>;
export const LinkIcon = (p: IconProps) => <Svg {...p}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></Svg>;
export const BuildingIcon = (p: IconProps) => <Svg {...p}><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4M10 10h4M10 14h4M10 18h4" /></Svg>;
export const DatabaseIcon = (p: IconProps) => <Svg {...p}><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></Svg>;
export const SearchIcon = (p: IconProps) => <Svg {...p} strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></Svg>;
export const GridIcon = (p: IconProps) => <Svg {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></Svg>;
export const ListIcon = (p: IconProps) => <Svg {...p}><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h.01M3 12h.01M3 18h.01" /></Svg>;
export const ChevronDownIcon = (p: IconProps) => <Svg {...p} strokeWidth={2.25}><path d="m6 9 6 6 6-6" /></Svg>;