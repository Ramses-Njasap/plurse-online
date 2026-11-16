// src/components/contact/SocialLinks.tsx

import type { ComponentType } from "react";

import { SOCIAL_LINKS } from "@/lib/contact/config";
import type { SocialPlatform } from "@/lib/contact/types";
import {
    ExternalIcon,
    FacebookIcon,
    InstagramIcon,
    LinkedInIcon,
    TikTokIcon,
    YouTubeIcon,
} from "./ContactIcons";

const PLATFORM_ICONS: Record<SocialPlatform, ComponentType<{ size?: number; className?: string }>> = {
    tiktok: TikTokIcon,
    facebook: FacebookIcon,
    youtube: YouTubeIcon,
    instagram: InstagramIcon,
    linkedin: LinkedInIcon,
};

/* Platforms are configured in lib/contact/config.ts (SOCIAL_LINKS).
   Any entry with an empty url is skipped, and the whole card disappears if none are set. */
export function SocialLinks() {
    const links = SOCIAL_LINKS.filter((link) => link.url.trim() !== "");
    if (links.length === 0) return null;

    return (
        <div
            className="rounded-2xl border bg-white p-6"
            style={{ borderColor: "var(--border)" }}
        >
            <h2 className="text-[16px] font-semibold" style={{ color: "var(--foreground)" }}>
                Find us online
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Follow Plurse for updates and product news, or message us on any of these.
            </p>

            <ul className="mt-4 grid grid-cols-2 gap-2">
                {links.map(({ platform, label, url }) => {
                    const Icon = PLATFORM_ICONS[platform];
                    return (
                        /* An odd last tile stretches across both columns so the grid stays tidy. */
                        <li key={platform} className="[&:last-child:nth-child(odd)]:col-span-2">
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Plurse on ${label} (opens in a new tab)`}
                                className="group flex h-[44px] items-center gap-2.5 rounded-xl border border-[var(--border)] bg-white px-3 text-[13px] font-medium text-[var(--text-muted)] transition-colors hover:border-[var(--brand)] hover:bg-[var(--brand-light)] hover:text-[var(--brand)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)]"
                            >
                                <Icon size={16} className="shrink-0" />
                                <span className="truncate">{label}</span>
                                <ExternalIcon
                                    size={12}
                                    className="ml-auto shrink-0 text-[var(--text-subtle)] transition-colors group-hover:text-[var(--brand)]"
                                />
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}