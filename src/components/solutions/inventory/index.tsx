import Hero from "./Hero";
import CategoryTree from "./CategoryTree";
import Features from "./Features";
import Outcomes from "./Outcomes";
import SolutionNav from "../shared/SolutionNav";
import { getSolutionNav } from "@/data/solutions/data";
import CTA from "@/components/home/cta/CTA";
import Footer from "@/components/Footer";

const { prev, next } = getSolutionNav("inventory");

export default function InventoryPage() {
    return (
        <main style={{ background: "var(--background)" }}>
            <Hero />
            <CategoryTree />
            <Features />
            <Outcomes />
            <SolutionNav prev={prev} next={next} />
            <CTA />
            <Footer />
        </main>
    );
}