// src/app/contact/page.tsx
// Place this next to your existing marketing pages (e.g. next to the "about" folder)
// so it inherits the same header/layout.

import type { Metadata } from "next";
import {
    ContactHero,
    ContactForm,
    CallCard,
    SocialLinks,
    HowItWorks,
} from "@/components/contact";

export const metadata: Metadata = {
    title: "Contact",
    description:
        "Message the Plurse team on WhatsApp, call us directly, or find us on TikTok, Facebook, YouTube, Instagram and LinkedIn.",
};

export default function ContactPage() {
    return (
        <main className="relative z-10 px-6 pb-24 pt-32 md:pt-36">
            <ContactHero />

            <section className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-[1.45fr_1fr] lg:items-start">
                <ContactForm />

                <aside className="space-y-6">
                    <CallCard />
                    <SocialLinks />
                    <HowItWorks />
                </aside>
            </section>
        </main>
    );
}