// index.tsx — About page assembler

import Opening from "./Opening";
import Mission from "./Mission";
import Pillars from "./Pillars";
import Today from "./Today";
import Founder from "./Founder";
import CTA from "./CTA";
import Footer from "../Footer";

export default function AboutPage() {
    return (
        <main style={{ background: "var(--background)" }}>
            <Opening />
            <Mission />
            <Pillars />
            <Today />
            <Founder />
            <CTA />
            <Footer />
        </main>
    );
}