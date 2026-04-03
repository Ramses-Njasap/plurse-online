// index.tsx — Cash Flow Clarity page assembler

import Hero from "./Hero";
import MoneyJourney from "./MoneyJourney";
import TransactionLedger from "./TransactionLedger";
import CreditGap from "./CreditGap";
import MarginIntelligence from "./MarginIntelligence";
import EdgeCases from "./EdgeCases";
import Outcomes from "./Outcomes";
import SolutionNav from "../shared/SolutionNav";
import { getSolutionNav } from "@/data/solutions/data";
import CTA from "@/components/home/cta/CTA";
import Footer from "@/components/Footer";

const { prev, next } = getSolutionNav("cashflow");

const CashFlowPage = () => {
    return (
        <main style={{ background: "var(--background)" }}>
            <Hero />
            <MoneyJourney />
            <TransactionLedger />
            <CreditGap />
            <MarginIntelligence />
            <EdgeCases />
            <Outcomes />
            <SolutionNav prev={prev} next={next} />
            <CTA />
            <Footer />
        </main>
    );
}

export default CashFlowPage;