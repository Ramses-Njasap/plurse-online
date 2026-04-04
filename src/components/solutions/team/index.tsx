// index.tsx — Team & Access Control page assembler

import Hero from "./Hero";
import RolesSection from "./RolesSection";
import ActivityLog from "./ActivityLog";
import ApprovalWorkflow from "./ApprovalWorkflow";
import EmployeeProfiles from "./EmployeeProfiles";
import Outcomes from "./Outcomes";
import SolutionNav from "../shared/SolutionNav";
import { getSolutionNav } from "@/data/solutions/data";
import CTA from "@/components/home/cta/CTA";
import Footer from "@/components/Footer";

const { prev, next } = getSolutionNav("team");

export default function TeamPage() {
    return (
        <main style={{ background: "var(--background)" }}>
            <Hero />
            <RolesSection />
            <ActivityLog />
            <ApprovalWorkflow />
            <EmployeeProfiles />
            <Outcomes />
            <SolutionNav prev={prev} next={next} />
            <CTA />
            <Footer />
        </main>
    );
}