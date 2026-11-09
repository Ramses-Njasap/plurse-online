// src/components/dashboard/overview/OverviewIcons.tsx

import type { CSSProperties } from "react";

interface IconProps { size?: number; className?: string; style?: CSSProperties }

function Svg({ size = 16, className, style, strokeWidth = 1.75, children }: IconProps & { strokeWidth?: number; children: React.ReactNode }) {
    return (
        <svg
            width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
            className={className} style={{ flexShrink: 0, ...style }} aria-hidden="true"
        >
            {children}
        </svg>
    );
}

export const ReceiptIcon = (p: IconProps) => <Svg {...p}><path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 1 .7V2l-1 .7-3-2-3 2-3-2-3 2-3-2z" /><path d="M8 8h8M8 12h8M8 16h5" /></Svg>;
export const WalletIcon = (p: IconProps) => <Svg {...p}><path d="M20 7H5a2 2 0 0 1 0-4h13v4" /><path d="M3 5v14a2 2 0 0 0 2 2h15V7" /><circle cx="16.5" cy="14" r="1" /></Svg>;
export const AlertIcon = (p: IconProps) => <Svg {...p}><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></Svg>;
export const CheckCircleIcon = (p: IconProps) => <Svg {...p}><circle cx="12" cy="12" r="10" /><path d="m8 12 3 3 5-6" /></Svg>;
export const InfoIcon = (p: IconProps) => <Svg {...p}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></Svg>;
export const ArrowRightIcon = (p: IconProps) => <Svg {...p} strokeWidth={2.25}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
export const RefreshIcon = (p: IconProps) => <Svg {...p} strokeWidth={2}><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></Svg>;
export const ShieldIcon = (p: IconProps) => <Svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></Svg>;