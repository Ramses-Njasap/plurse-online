// index.tsx — Customer Relationships page assembler

import Hero from "./Hero";
import Profile from "./Profile";
import Segments from "./Segments";
import Credit from "./Credit";
import Outcomes from "./Outcomes";
import SolutionNav from "../shared/SolutionNav";
import { getSolutionNav } from "@/data/solutions/data";
import CTA from "@/components/home/cta/CTA";
import Footer from "@/components/Footer";

const { prev, next } = getSolutionNav("customers");

export default function CustomersPage() {
    return (
        <main style={{ background: "var(--background)" }}>
            <Hero />
            <Profile />
            <Segments />
            <Credit />
            <Outcomes />
            <SolutionNav prev={prev} next={next} />
            <CTA />
            <Footer />
        </main>
    );
}