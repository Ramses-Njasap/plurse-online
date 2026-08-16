// src/app/solutions/team/page.tsx
import TeamPage from "@/components/solutions/team";

export const metadata = {
    title: "Team & Access Control — Plurse",
    description: "Assign roles, log every action and enforce approval chains. Your team trusted, your data protected.",
};

const Team = () => {
    return <TeamPage />;
};

export default Team;