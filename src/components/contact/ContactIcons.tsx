// src/components/contact/ContactIcons.tsx

interface IconProps {
    size?: number;
    className?: string;
}

function Svg({ size = 16, className, children }: IconProps & { children: React.ReactNode }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            {children}
        </svg>
    );
}

export function PhoneIcon(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </Svg>
    );
}

export function MessageIcon(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </Svg>
    );
}

export function SendIcon(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
        </Svg>
    );
}

export function ChevronDownIcon(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="m6 9 6 6 6-6" />
        </Svg>
    );
}

export function CheckIcon(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M20 6 9 17l-5-5" />
        </Svg>
    );
}

export function CopyIcon(props: IconProps) {
    return (
        <Svg {...props}>
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </Svg>
    );
}

export function ClockIcon(props: IconProps) {
    return (
        <Svg {...props}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
        </Svg>
    );
}

/* ── Social platform icons (simple outline style to match the rest of the site) ── */

export function TikTokIcon(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917z" />
        </Svg>
    );
}

export function FacebookIcon(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </Svg>
    );
}

export function YouTubeIcon(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
            <path d="m10 15 5-3-5-3z" />
        </Svg>
    );
}

export function InstagramIcon(props: IconProps) {
    return (
        <Svg {...props}>
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <path d="M17.5 6.5h.01" />
        </Svg>
    );
}

export function LinkedInIcon(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
        </Svg>
    );
}

export function ExternalIcon(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M7 7h10v10" />
            <path d="M7 17 17 7" />
        </Svg>
    );
}