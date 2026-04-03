// index.tsx — Sales Intelligence page assembler

import Hero from "./Hero";
import CustomerIntelligence from "./CustomerIntelligence";
import PaymentMethods from "./PaymentMethods";
import CreditInstallments from "./CreditInstallments";
import Analytics from "./Analytics";
import Outcomes from "./Outcomes";
import SolutionNav from "../shared/SolutionNav";
import { getSolutionNav } from "@/data/solutions/data";
import CTA from "@/components/home/cta/CTA";
import Footer from "@/components/Footer";

const { prev, next } = getSolutionNav("sales");

export default function SalesPage() {
    return (
        <main style={{ background: "var(--background)" }}>
            <Hero />
            <CustomerIntelligence />
            <PaymentMethods />
            <CreditInstallments />
            <Analytics />
            <Outcomes />
            <SolutionNav prev={prev} next={next} />
            <CTA />
            <Footer />
        </main>
    );
}